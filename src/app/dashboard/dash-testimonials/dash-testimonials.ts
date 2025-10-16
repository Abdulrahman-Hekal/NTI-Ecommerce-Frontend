import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ITestimonial } from '../../core/models/testimonial.model';
import { TestimonialsService } from '../../core/services/testimonialsService/testimonials.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-dash-testimonials',
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './dash-testimonials.html',
  styleUrl: './dash-testimonials.css',
})
export class DashTestimonials implements OnInit {
  // Properties
  nonApprovedTestimonials = signal<ITestimonial[]>([]);
  approvedTestimonials = signal<ITestimonial[]>([]);
  targetTestimonial = signal<ITestimonial>({} as ITestimonial);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Injections
  private readonly _testimonialsService = inject(TestimonialsService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this.getNonApproved();
    this.getApproved();
  }

  // Methods
  // Get
  getNonApproved() {
    this._testimonialsService
      .getNonApprovedTestimonials()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.nonApprovedTestimonials.set(res.data);
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
  getApproved() {
    this._testimonialsService
      .getApprovedTestimonials()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.approvedTestimonials.set(res.data);
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

  // Set Target
  setTarget(testimonial: ITestimonial) {
    this.targetTestimonial.set(testimonial);
  }

  // Approve
  approveTestimonial() {
    this._testimonialsService
      .approveTestimonial(this.targetTestimonial()._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getNonApproved();
          this.getApproved();
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
  deleteTestimonial() {
    this._testimonialsService
      .deleteTestimonial(this.targetTestimonial()._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getNonApproved();
          this.getApproved();
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
