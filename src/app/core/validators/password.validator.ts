import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
  static dismatchPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const password = control.parent?.get('password')?.value;
      return value === password ? null : { dismatchpassword: true };
    };
  }
}
