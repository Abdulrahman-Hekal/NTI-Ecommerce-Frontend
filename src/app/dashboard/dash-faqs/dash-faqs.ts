import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FaqsService } from '../../core/services/faqsService/faqs.service';
import { IFaq, IFaqData } from '../../core/models/faq.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dash-faqs',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dash-faqs.html',
  styleUrl: './dash-faqs.css',
})
export class DashFaqs implements OnInit {
  // Properties
  faqsList = signal<IFaq[]>([]);
  faqForm = new FormGroup({
    question: new FormControl('', Validators.required),
    answer: new FormControl('', Validators.required),
  });
  updateFaqForm = new FormGroup({
    question: new FormControl('', Validators.required),
    answer: new FormControl('', Validators.required),
  });
  targetFaq = signal<IFaq>({} as IFaq);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Injections
  private readonly _faqsService = inject(FaqsService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this.getFaqs();
  }

  // Methods
  // Get
  getFaqs() {
    this._faqsService
      .getFaqs()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.faqsList.set(res.data);
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
  addFaq() {
    if (this.faqForm.valid) {
      this._faqsService
        .addFaq(this.faqForm.value as IFaqData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getFaqs();
            this.faqForm.reset();
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

  // Update
  updateFaq(faq: IFaq) {
    this.targetFaq.set(faq);
    this.updateFaqForm.patchValue({
      question: this.targetFaq().question.replace('?', ''),
      answer: this.targetFaq().answer,
    });
  }
  confirmUpdate() {
    if (this.updateFaqForm.valid) {
      this._faqsService
        .updateFaq(this.targetFaq()._id, this.updateFaqForm.value as IFaqData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getFaqs();
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
  deleteFaq(faq: IFaq) {
    this.targetFaq.set(faq);
  }
  confirmDelete() {
    this._faqsService
      .deleteFaq(this.targetFaq()._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getFaqs();
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
