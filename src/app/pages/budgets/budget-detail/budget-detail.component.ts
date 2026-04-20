import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgClass, RouterModule, MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './budget-detail.component.html',
  styleUrl: './budget-detail.component.scss'
})
export class BudgetDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly budgetService = inject(BudgetService);

  readonly milestoneColumns = ['title', 'dueDate', 'owner', 'status'];

  readonly viewModel$ = this.route.paramMap.pipe(
    map(params => params.get('id') ?? ''),
    switchMap(planId =>
      combineLatest({
        plan: this.budgetService.getPlanById(planId),
        milestones: this.budgetService.getReviewTimeline(planId)
      })
    )
  );
}