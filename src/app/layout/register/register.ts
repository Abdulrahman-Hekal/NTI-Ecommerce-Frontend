import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUserData } from '../../core/models/user.model';
import { PasswordValidator } from '../../core/validators/password.validator';
import { AuthService } from '../../core/services/authService/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // Properties
  isError = signal(false);
  alertMessage = signal('');
  // Forms
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      PasswordValidator.dismatchPassword(),
    ]),
    phones: new FormArray([
      new FormGroup({
        number: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
        isDefault: new FormControl(true),
      }),
    ]),
    addresses: new FormArray([
      new FormGroup({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        governorate: new FormControl('', [Validators.required]),
        isDefault: new FormControl(true),
      }),
    ]),
  });
  // Injections
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);

  // Methods
  // For phones input
  get phones() {
    return this.registerForm.get('phones') as FormArray;
  }

  addPhone() {
    const phones = this.registerForm.get('phones') as FormArray;
    phones.push(
      new FormGroup({
        number: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
        isDefault: new FormControl(false),
      })
    );
  }

  removePhone(index: number) {
    const phones = this.registerForm.get('phones') as FormArray;
    phones.removeAt(index);
  }

  // For addresses input
  get addresses() {
    return this.registerForm.get('addresses') as FormArray;
  }

  addAddress() {
    const addresses = this.registerForm.get('addresses') as FormArray;
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
    const addresses = this.registerForm.get('addresses') as FormArray;
    addresses.removeAt(index);
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

  // For submit
  register() {
    delete this.registerForm.value.confirmPassword;
    const data = this.registerForm.value as IUserData;
    this._authService
      .userRegister(data)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
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
