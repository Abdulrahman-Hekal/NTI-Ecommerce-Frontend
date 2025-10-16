import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { IAdminData, IUser } from '../../core/models/user.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../core/services/usersService/users.service';
import { PasswordValidator } from '../../core/validators/password.validator';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dash-admins',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dash-admins.html',
  styleUrl: './dash-admins.css',
})
export class DashAdmins implements OnInit {
  // Properties
  adminsList = signal<IUser[]>([]);
  adminForm = new FormGroup({
    name: new FormControl('', Validators.required),
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
  });
  targetAdmin = signal<IUser>({} as IUser);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Injections
  private readonly _usersService = inject(UsersService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this.getAdmins();
  }

  // Methods
  // Get
  getAdmins() {
    this._usersService
      .getAllAdmins()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.adminsList.set(res.data);
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

  // Add
  addAdmin() {
    if (this.adminForm.valid) {
      delete this.adminForm.value.confirmPassword;
      this._usersService
        .addAdmin(this.adminForm.value as IAdminData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getAdmins();
            this.adminForm.reset();
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

  // Delete
  setTarget(admin: IUser) {
    this.targetAdmin.set(admin);
  }
  confirmDelete() {
    this._usersService
      .deleteUserById(this.targetAdmin()._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getAdmins();
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
