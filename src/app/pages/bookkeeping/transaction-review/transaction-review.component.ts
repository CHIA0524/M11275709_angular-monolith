import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FakeTransactionApiService } from '../fake-transaction-api.service';
import { TransactionIntelligenceService } from '../transaction-intelligence.service';

@Component({
  selector: 'app-transaction-review',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './transaction-review.component.html',
  styleUrl: './transaction-review.component.scss'
})
export class TransactionReviewComponent {
  private readonly intelligenceService = inject(TransactionIntelligenceService);
  private readonly transactionApi = inject(FakeTransactionApiService);
  readonly analytics$ = this.intelligenceService.getAnalytics('收入');
  readonly recurring$ = this.intelligenceService.getRecurringCandidates();
  readonly reconciliation$ = this.transactionApi.getReconciliationVm({
    groupBy: 'category',
    sortBy: 'amount',
    sortDirection: 'desc'
  });
}