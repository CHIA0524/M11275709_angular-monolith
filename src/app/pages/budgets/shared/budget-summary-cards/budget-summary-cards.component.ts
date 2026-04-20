import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BudgetSummary } from '../../../../core/services/budget.service';

@Component({
  selector: 'app-budget-summary-cards',
  standalone: true,
  imports: [CurrencyPipe, MatCardModule],
  templateUrl: './budget-summary-cards.component.html',
  styleUrl: './budget-summary-cards.component.scss'
})
export class BudgetSummaryCardsComponent {
  readonly summary = input.required<BudgetSummary>();
}