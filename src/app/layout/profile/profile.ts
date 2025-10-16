import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../core/models/user.model';
import { UsersService } from '../../core/services/usersService/users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/authService/auth.service';
import { Router } from '@angular/router';
import { PasswordValidator } from '../../core/validators/password.validator';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule, TitleCasePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  // Properties
  userData = signal<IUser>({} as IUser);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Forms
  editForm!: FormGroup;
  // Injections
  private readonly _usersService = inject(UsersService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this.getUser();
  }

  // Methods
  // For phones input
  get phones() {
    return this.editForm.get('phones') as FormArray;
  }

  addPhone() {
    const phones = this.editForm.get('phones') as FormArray;
    phones.push(
      new FormGroup({
        number: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
        isDefault: new FormControl(false),
      })
    );
  }

  removePhone(index: number) {
    const phones = this.editForm.get('phones') as FormArray;
    phones.removeAt(index);
  }

  // For addresses input
  get addresses() {
    return this.editForm.get('addresses') as FormArray;
  }

  addAddress() {
    const addresses = this.editForm.get('addresses') as FormArray;
    addresses.push(
      new FormGroup({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        governorate: new FormControl('', [Validators.required]),
        isDefault: new FormControl(false),
      })
    );
  }

  removeAddress(index: number) {
    const addresses = this.editForm.get('addresses') as FormArray;
    addresses.removeAt(index);
  }

  // Form setup
  setupForm() {
    const phones = [];
    const addresses = [];
    for (const phone of this.userData().phones) {
      phones.push(
        new FormGroup({
          number: new FormControl(phone.number, [
            Validators.required,
            Validators.pattern(/^\d{11}$/),
          ]),
          isDefault: new FormControl(phone.isDefault),
        })
      );
    }
    if (phones.length === 0) {
      phones.push(
        new FormGroup({
          number: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
          isDefault: new FormControl(true),
        })
      );
    }
    for (const address of this.userData().addresses) {
      addresses.push(
        new FormGroup({
          street: new FormControl(address.street, [Validators.required]),
          city: new FormControl(address.city, [Validators.required]),
          governorate: new FormControl(address.governorate, [Validators.required]),
          isDefault: new FormControl(address.isDefault),
        })
      );
    }
    if (addresses.length === 0) {
      addresses.push(
        new FormGroup({
          street: new FormControl('', [Validators.required]),
          city: new FormControl('', [Validators.required]),
          governorate: new FormControl('', [Validators.required]),
          isDefault: new FormControl(true),
        })
      );
    }
    this.editForm = new FormGroup({
      name: new FormControl(this.userData().name, [Validators.required]),
      email: new FormControl(this.userData().email, [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      ]),
      prevPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        PasswordValidator.dismatchPassword(),
      ]),
      phones: new FormArray(phones),
      addresses: new FormArray(addresses),
    });
  }

  // For Radio Buttons
  setPhoneDefault(index: number) {
    this.phones.controls.forEach((phone, i) => {
      if (index === i) {
        phone.patchValue({ isDefault: true });
      } else {
        phone.patchValue({ isDefault: false });
      }
    });
  }
  setAddressDefault(index: number) {
    this.addresses.controls.forEach((address, i) => {
      if (index === i) {
        address.patchValue({ isDefault: true });
      } else {
        address.patchValue({ isDefault: false });
      }
    });
  }

  // get
  getUser() {
    this._usersService
      .getLoggedInUser()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.userData.set(res.data);
          this.setupForm();
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

  // edit
  isCorrectPassword() {
    const data = {
      email: this.userData().email,
      password: this.editForm.get('prevPassword')?.value,
    };
    this._authService
      .userLogin(data, true)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.confirmEdit();
        },
        error: (res) => {
          this.alertMessage.set('Incorrect Password');
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }
  confirmEdit() {
    delete this.editForm.value.prevPassword;
    delete this.editForm.value.confirmPassword;
    this._usersService
      .updateCurrentProfile(this.editForm.value)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getUser();
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

  // delete
  confirmDelete() {
    this._usersService
      .deleteCurrentProfile()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this._router.navigate(['/home']);
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

  // Logout
  logout() {
    this._authService.userLogout();
  }
}
