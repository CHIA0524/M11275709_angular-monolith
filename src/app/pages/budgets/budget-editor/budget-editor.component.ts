import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BudgetPlan, BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budget-editor',
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
    MatSelectModule
  ],
  templateUrl: './budget-editor.component.html',
  styleUrl: './budget-editor.component.scss'
})
export class BudgetEditorComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly budgetService = inject(BudgetService);
  private readonly destroyRef = inject(DestroyRef);

  currentPlan: BudgetPlan | undefined;

  readonly editForm = this.formBuilder.group({
    category: [''],
    owner: [''],
    period: [''],
    monthlyLimit: [0],
    spent: [0],
    status: ['healthy']
  });

  readonly plan$ = this.route.paramMap.pipe(
    switchMap(params => this.budgetService.getPlanById(params.get('id') ?? ''))
  );

  constructor() {
    this.plan$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(plan => {
      this.currentPlan = plan;

      if (!plan) {
        return;
      }

      this.editForm.patchValue({
        category: plan.category,
        owner: plan.owner,
        period: plan.period,
        monthlyLimit: plan.monthlyLimit,
        spent: plan.spent,
        status: plan.status
      });
    });
  }
}