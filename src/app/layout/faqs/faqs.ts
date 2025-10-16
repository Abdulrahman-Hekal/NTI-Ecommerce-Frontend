import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FaqsService } from '../../core/services/faqsService/faqs.service';
import { IFaq } from '../../core/models/faq.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faqs',
  imports: [CommonModule],
  templateUrl: './faqs.html',
  styleUrl: './faqs.css',
})
export class Faqs implements OnInit {
  // Properties
  faqsList = signal<IFaq[]>([]);
  isError = signal(false);
  alertMessage = signal('');
  // Injections
  private readonly _faqsService = inject(FaqsService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
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
}
