import { AsyncPipe, CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FakeTransactionApiService } from '../fake-transaction-api.service';

@Component({
  selector: 'app-transaction-reconciliation',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, JsonPipe, RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './transaction-reconciliation.component.html',
  styleUrl: './transaction-reconciliation.component.scss'
})
export class TransactionReconciliationComponent {
  private readonly transactionApi = inject(FakeTransactionApiService);

  readonly vm$ = this.transactionApi.getReconciliationVm({
    groupBy: 'category',
    sortBy: 'amount',
    sortDirection: 'desc',
    minAmount: 100
  });
}