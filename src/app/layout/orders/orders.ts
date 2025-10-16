import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { IOrder, IOrderData } from '../../core/models/order.model';
import { OrdersService } from '../../core/services/ordersService/orders.service';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  NgOptimizedImage,
  provideImgixLoader,
  TitleCasePipe,
} from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { EStatus } from '../../core/models/enums';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    NgOptimizedImage,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideImgixLoader(environment.staticUrl)],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  // Properties
  orders = signal<IOrder[]>([]);
  targetOrder = signal<IOrder>({} as IOrder);
  allStatus = [
    EStatus.pending,
    EStatus.preparing,
    EStatus.shipped,
    EStatus.delivered,
    EStatus.cancelled,
    EStatus.rejected,
  ];
  yellowStatus = [EStatus.pending, EStatus.preparing];
  greenStatus = [EStatus.shipped, EStatus.delivered];
  redStatus = [EStatus.cancelled, EStatus.rejected];
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Forms
  selectedStatue = '';
  editForm = new FormGroup({
    products: new FormArray([
      new FormGroup({
        productId: new FormControl('', Validators.required),
        quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
      }),
    ]),
    shippingAddress: new FormGroup({
      governorate: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
    }),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
  });
  // Injections
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this.getOrders();
  }

  // Methods
  // Get
  getOrders(status?: string) {
    this._ordersService
      .getUserOrders(status)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.orders.set(res.data);
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }
  applyFilter() {
    this.getOrders(this.selectedStatue);
  }

  // products form array
  get products() {
    return this.editForm.get('products') as FormArray;
  }

  // Edit
  updateOrder(order: IOrder) {
    this.targetOrder.set(order);
    const products: any = new FormArray([]);
    order.products.forEach((item) => {
      products.push(
        new FormGroup({
          productId: new FormControl(item.product._id, Validators.required),
          quantity: new FormControl(item.quantity, [Validators.required, Validators.min(1)]),
        })
      );
    });
    this.editForm.setControl('products', products as FormArray);
    this.editForm.patchValue({
      shippingAddress: order.shippingAddress,
      phone: order.phone,
    });
    console.log(products);
    console.log(this.editForm.value);
  }
  confirmUpdate() {
    if (this.editForm.valid) {
      this._ordersService
        .updateOrder(this.targetOrder()._id, this.editForm.value as IOrderData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getOrders();
            this.editForm.reset();
            this.alertMessage.set(res.message);
            this.isSuccess.set(true);
            setTimeout(() => {
              this.isSuccess.set(false);
            }, 2500);
          },
          error: (res) => {
            this.alertMessage.set(res.error.message);
            this.isError.set(true);
            setTimeout(() => {
              this.isError.set(false);
            }, 2500);
          },
        });
    } else {
      this.alertMessage.set('The Form is not Valid');
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 2500);
    }
  }

  // Cancel
  setTarget(order: IOrder) {
    this.targetOrder.set(order);
  }
  cancelOrder() {
    this._ordersService
      .cancelOrder(this.targetOrder()._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getOrders();
          this.alertMessage.set(res.message);
          this.isSuccess.set(true);
          setTimeout(() => {
            this.isSuccess.set(false);
          }, 2500);
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }

  // Delete
  deleteOrder() {
    this._ordersService
      .deleteOrder(this.targetOrder()._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getOrders();
          this.alertMessage.set(res.message);
          this.isSuccess.set(true);
          setTimeout(() => {
            this.isSuccess.set(false);
          }, 2500);
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }
}
