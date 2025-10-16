import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ITestimonial, ITestimonialData } from '../../../core/models/testimonial.model';
import { AuthService } from '../../../core/services/authService/auth.service';
import { TestimonialsService } from '../../../core/services/testimonialsService/testimonials.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ERole } from '../../../core/models/enums';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-testimonial',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './testimonial.html',
  styleUrl: './testimonial.css',
})
export class Testimonial implements OnInit {
  // Properties
  testimonials = signal<ITestimonial[]>([]);
  testimonialForm = new FormGroup({
    message: new FormControl('', Validators.required),
    rating: new FormControl(5, [Validators.required, Validators.min(1), Validators.max(5)]),
  });
  isUser = signal(false);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Injections
  private readonly _authService = inject(AuthService);
  private readonly _testimonialsService = inject(TestimonialsService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this._testimonialsService
      .getApprovedTestimonials()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.testimonials.set(res.data);
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
    this._authService.authData$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
      if (data) {
        this.isUser.set(data.role === ERole.user);
      } else {
        this.isUser.set(false);
      }
    });
  }

  // Methods
  // Add
  addTestimonial() {
    if (this.testimonialForm.valid) {
      this._testimonialsService
        .addTestimonial(this.testimonialForm.value as ITestimonialData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
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
      this.alertMessage.set('The Form is not valid');
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 2500);
    }
  }
}
