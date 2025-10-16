import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService/auth.service';
import { ERole } from '../models/enums';

export const superAdminGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);
  if (_authService.isRole(ERole.superAdmin)) {
    return true;
  }
  _router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);
  if (_authService.isRole(ERole.admin) || _authService.isRole(ERole.superAdmin)) {
    return true;
  }
  _router.navigate(['/login']);
  return false;
};

export const userGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);
  if (
    _authService.isRole(ERole.user) ||
    _authService.isRole(ERole.admin) ||
    _authService.isRole(ERole.superAdmin)
  ) {
    return true;
  }
  _router.navigate(['/login']);
  return false;
};
