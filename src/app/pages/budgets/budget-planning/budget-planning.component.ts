import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { combineLatest, map, startWith, Subject } from 'rxjs';
import { BudgetFilterBarComponent } from '../shared/budget-filter-bar/budget-filter-bar.component';
import { BudgetFilters, BudgetPlan, BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budget-planning',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    BudgetFilterBarComponent
  ],
  templateUrl: './budget-planning.component.html',
  styleUrl: './budget-planning.component.scss'
})
export class BudgetPlanningComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly budgetService = inject(BudgetService);
  private currentFilters: BudgetFilters = { keyword: '', owner: 'all', status: 'all' };
  private readonly filtersChange$ = new Subject<BudgetFilters>();

  readonly plans$ = this.budgetService.getPlans();
  readonly owners$ = this.plans$.pipe(map(plans => [...new Set(plans.map(plan => plan.owner))]));
  readonly displayedColumns = ['category', 'period', 'monthlyLimit', 'spent', 'actions'];
  readonly filteredPlans$ = combineLatest([
    this.plans$,
    this.filtersChange$.pipe(startWith(this.currentFilters))
  ]).pipe(
    map(([plans, filters]) => plans.filter(plan => this.matchesFilters(plan, filters)))
  );

  readonly planForm = this.formBuilder.group({
    category: ['生活支出'],
    owner: ['個人'],
    monthlyLimit: [18000],
    reviewCycle: ['每月']
  });

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