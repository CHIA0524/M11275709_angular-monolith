import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { evaluate } from 'mathjs';
import { ProjectionTableComponent } from '../shared/projection-table/projection-table.component';

@Component({
  selector: 'app-dashboard-scenarios',
  standalone: true,
  imports: [DecimalPipe, FormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ProjectionTableComponent],
  templateUrl: './dashboard-scenarios.component.html',
  styleUrl: './dashboard-scenarios.component.scss'
})
export class DashboardScenariosComponent {
  readonly currentNetWorth = signal(2480000);
  readonly monthlyInvestment = signal(18000);
  readonly monthlyExpenseDelta = signal(2500);
  readonly conservativeFormula = signal('base + (investment - expenseDelta) * month');
  readonly optimisticFormula = signal('base + (investment * 1.25 - expenseDelta * 0.7) * month');
  readonly stressFormula = signal('base + (investment * 0.65 - expenseDelta * 1.4) * month');
  readonly projectionResult = computed(() => {
    const base = this.currentNetWorth();
    const investment = this.monthlyInvestment();
    const expenseDelta = this.monthlyExpenseDelta();
    const conservativeFormula = this.conservativeFormula();
    const optimisticFormula = this.optimisticFormula();
    const stressFormula = this.stressFormula();

    try {
      const rows = Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const scope = { base, investment, expenseDelta, month };

        return {
          month,
          conservative: this.evaluateFormula(conservativeFormula, scope),
          optimistic: this.evaluateFormula(optimisticFormula, scope),
          stress: this.evaluateFormula(stressFormula, scope)
        };
      });

      return { rows, error: null as string | null };
    } catch (error) {
      return {
        rows: [] as Array<{ month: number; conservative: number; optimistic: number; stress: number }>,
        error: error instanceof Error ? error.message : '公式解析失敗'
      };
    }
  });

  readonly scenarioProjection = computed(() => this.projectionResult().rows);
  readonly formulaSummary = computed(() => {
    const finalMonth = this.projectionResult().rows.at(-1);

    return finalMonth
      ? {
          conservative: finalMonth.conservative,
          optimistic: finalMonth.optimistic,
          stress: finalMonth.stress
        }
      : null;
  });

  readonly projectionRows = computed(() => this.scenarioProjection().map(item => ({
    month: `M${item.month}`,
    conservative: item.conservative,
    optimistic: item.optimistic,
    stress: item.stress
  })));

  resetFormulas(): void {
    this.conservativeFormula.set('base + (investment - expenseDelta) * month');
    this.optimisticFormula.set('base + (investment * 1.25 - expenseDelta * 0.7) * month');
    this.stressFormula.set('base + (investment * 0.65 - expenseDelta * 1.4) * month');
  }

  private evaluateFormula(expression: string, scope: Record<string, number>): number {
    const result = evaluate(expression, scope);

    if (typeof result !== 'number' || Number.isNaN(result) || !Number.isFinite(result)) {
      throw new Error(`公式結果無效：${expression}`);
    }

    return Math.round(result);
  }
}