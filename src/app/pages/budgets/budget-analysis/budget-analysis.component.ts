import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budget-analysis',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgClass, RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './budget-analysis.component.html',
  styleUrl: './budget-analysis.component.scss'
})
export class BudgetAnalysisComponent {
  private readonly budgetService = inject(BudgetService);

  readonly performance$ = this.budgetService.getCategoryPerformance();
}