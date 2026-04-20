import { Component, EventEmitter, OnInit, Output, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { startWith } from 'rxjs/operators';
import { BudgetFilters, BudgetPlan } from '../../../../core/services/budget.service';

type BudgetFilterFormValue = {
  keyword: string | null;
  owner: string | null;
  status: 'all' | BudgetPlan['status'] | null;
};

@Component({
  selector: 'app-budget-filter-bar',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './budget-filter-bar.component.html',
  styleUrl: './budget-filter-bar.component.scss'
})
export class BudgetFilterBarComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly owners = input<string[]>([]);
  readonly statuses = input<Array<'all' | BudgetPlan['status']>>(['all', 'healthy', 'warning', 'critical']);

  @Output() readonly filtersChange = new EventEmitter<BudgetFilters>();

  readonly filterForm = this.formBuilder.group({
    keyword: [''],
    owner: ['all'],
    status: ['all' as 'all' | BudgetPlan['status']]
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue())).subscribe((value: Partial<BudgetFilterFormValue>) => {
      this.filtersChange.emit({
        keyword: value.keyword ?? '',
        owner: value.owner ?? 'all',
        status: value.status ?? 'all'
      });
    });
  }

  resetFilters(): void {
    this.filterForm.reset({ keyword: '', owner: 'all', status: 'all' });
  }
}