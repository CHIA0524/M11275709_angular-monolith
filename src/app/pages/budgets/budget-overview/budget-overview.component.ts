import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Subject, combineLatest, map, startWith } from 'rxjs';
import { BudgetFilterBarComponent } from '../shared/budget-filter-bar/budget-filter-bar.component';
import { BudgetSummaryCardsComponent } from '../shared/budget-summary-cards/budget-summary-cards.component';
import { BudgetFilters, BudgetPlan, BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budget-overview',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    NgClass,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    BudgetFilterBarComponent,
    BudgetSummaryCardsComponent
  ],
  templateUrl: './budget-overview.component.html',
  styleUrl: './budget-overview.component.scss'
})
export class BudgetOverviewComponent {
  private readonly budgetService = inject(BudgetService);
  private currentFilters: BudgetFilters = { keyword: '', owner: 'all', status: 'all' };
  private readonly filtersChange$ = new Subject<BudgetFilters>();

  readonly summary$ = this.budgetService.getSummary();
  readonly plans$ = this.budgetService.getPlans();
  readonly displayedColumns = ['category', 'owner', 'monthlyLimit', 'spent', 'status', 'actions'];
  readonly owners$ = this.plans$.pipe(map(plans => [...new Set(plans.map(plan => plan.owner))]));
  readonly filteredPlans$ = combineLatest([
    this.plans$,
    this.filtersChange$.pipe(startWith(this.currentFilters))
  ]).pipe(
    map(([plans, filters]) => plans.filter(plan => this.matchesFilters(plan, filters)))
  );

  updateFilters(filters: BudgetFilters): void {
    this.currentFilters = filters;
    this.filtersChange$.next(filters);
  }

  private matchesFilters(plan: BudgetPlan, filters: BudgetFilters): boolean {
    const matchesKeyword = !filters.keyword || plan.category.includes(filters.keyword) || plan.owner.includes(filters.keyword);
    const matchesOwner = filters.owner === 'all' || plan.owner === filters.owner;
    const matchesStatus = filters.status === 'all' || plan.status === filters.status;

    return matchesKeyword && matchesOwner && matchesStatus;
  }
}