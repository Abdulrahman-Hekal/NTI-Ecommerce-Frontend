import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/services/authService/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ERole } from '../../core/models/enums';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dash-header',
  imports: [TitleCasePipe, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dash-header.html',
  styleUrl: './dash-header.css',
})
export class DashHeader implements OnInit {
  // Properties
  username = signal('guest');
  isSuperAdmin = signal(false);
  // Injections
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this._authService.authData$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
      if (data) {
        this.username.set(data.name);
        this.isSuperAdmin.set(data.role === ERole.superAdmin);
      } else {
        this.username.set('guest');
        this.isSuperAdmin.set(false);
      }
    });
  }
}
