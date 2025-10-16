import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/authService/auth.service';
import { ILoginData } from '../../core/models/auth.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Properties
  isError = signal(false);
  alertMessage = signal('');
  // Forms
  loginForm = new FormGroup({
    email: new FormControl('ali@gmail.com'),
    password: new FormControl('Aa123456'),
  });
  // Injections
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);

  // Methods
  // For submit
  login() {
    const loginData = this.loginForm.value as ILoginData;
    this._authService
      .userLogin(loginData)
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
