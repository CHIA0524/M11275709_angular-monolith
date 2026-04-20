import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProjectionTableComponent } from '../shared/projection-table/projection-table.component';

@Component({
  selector: 'app-dashboard-scenarios',
  standalone: true,
  imports: [FormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ProjectionTableComponent],
  templateUrl: './dashboard-scenarios.component.html',
  styleUrl: './dashboard-scenarios.component.scss'
})
export class DashboardScenariosComponent {
  readonly currentNetWorth = signal(2480000);
  readonly monthlyInvestment = signal(18000);
  readonly monthlyExpenseDelta = signal(2500);
  readonly scenarioProjection = computed(() => {
    const base = this.currentNetWorth();
    const investment = this.monthlyInvestment();
    const expenseDelta = this.monthlyExpenseDelta();

    return Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      conservative: Math.round(base + (investment - expenseDelta) * (index + 1)),
      optimistic: Math.round(base + (investment * 1.25 - expenseDelta * 0.7) * (index + 1)),
      stress: Math.round(base + (investment * 0.65 - expenseDelta * 1.4) * (index + 1))
    }));
  });

  readonly projectionRows = computed(() => this.scenarioProjection().map(item => ({
    month: `M${item.month}`,
    conservative: item.conservative,
    optimistic: item.optimistic,
    stress: item.stress
  })));
}