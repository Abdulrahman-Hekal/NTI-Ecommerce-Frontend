import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { IOrder, IOrderQuery } from '../../core/models/order.model';
import { OrdersService } from '../../core/services/ordersService/orders.service';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  NgOptimizedImage,
  provideImgixLoader,
  TitleCasePipe,
} from '@angular/common';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EStatus } from '../../core/models/enums';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dash-orders',
  imports: [CommonModule, NgOptimizedImage, DatePipe, CurrencyPipe, TitleCasePipe, FormsModule],
  providers: [provideImgixLoader(environment.staticUrl)],
  templateUrl: './dash-orders.html',
  styleUrl: './dash-orders.css',
})
export class DashOrders implements OnInit {
  // Properties
  orders = signal<IOrder[]>([]);
  targetOrder = signal<IOrder>({} as IOrder);
  availableStatus = [EStatus.pending, EStatus.preparing, EStatus.shipped, EStatus.delivered];
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
  statusInput!: EStatus;
  // Injections
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this.getOrders();
  }

  // Methods
  // Get
  getOrders(query?: IOrderQuery) {
    this._ordersService
      .getAllOrders(query)
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
    this.getOrders({ status: this.selectedStatue });
  }

  // Edit
  setTarget(order: IOrder) {
    this.targetOrder.set(order);
    this.statusInput = this.targetOrder().status;
  }
  changeStatus() {
    this._ordersService
      .changeStatus(this.targetOrder()._id, this.statusInput)
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

  // Reject
  rejectOrder() {
    this._ordersService
      .rejectOrder(this.targetOrder()._id)
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
