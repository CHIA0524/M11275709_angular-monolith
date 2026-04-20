import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { addMonths, format } from 'date-fns';
import { EMPTY, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { z } from 'zod';
import { DashboardData, DashboardService, MonthlyTransaction } from '../../core/services/dashboard.service';

const monthlyTransactionSchema = z.object({
  month: z.string(),
  income: z.number(),
  expense: z.number()
});

const dashboardDataSchema = z.object({
  totalAssets: z.number(),
  monthlyIncome: z.number(),
  monthlyExpense: z.number(),
  netWorth: z.number(),
  assetTrends: z.array(z.object({
    date: z.string(),
    totalAssets: z.number(),
    cash: z.number(),
    investment: z.number(),
    property: z.number()
  })),
  expenseBreakdown: z.array(z.object({
    category: z.string(),
    amount: z.number(),
    percentage: z.number()
  }))
});

export interface DashboardInsightVm {
  monthlyAverageIncome: number;
  monthlyAverageExpense: number;
  savingsRate: number;
  topExpenseCategory: string;
  topExpenseAmount: number;
  forecastNetWorth: Array<{ month: string; value: number }>;
}

interface DashboardAnalysisState {
  loading: boolean;
  dashboardData: DashboardData | null;
  monthlyTransactions: MonthlyTransaction[];
  error: string | null;
}

@Injectable()
export class DashboardAnalysisStore extends ComponentStore<DashboardAnalysisState> {
  private readonly dashboardService = inject(DashboardService);

  readonly vm$ = this.select(state => this.buildVm(state.dashboardData, state.monthlyTransactions));
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);

  constructor() {
    super({
      loading: false,
      dashboardData: null,
      monthlyTransactions: [],
      error: null
    });
  }

  readonly load = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      tap(() => {
        forkJoin({
          dashboard: this.dashboardService.getDashboardData(),
          monthly: this.dashboardService.getMonthlyTransactions()
        })
          .pipe(
            tap(({ dashboard, monthly }) => {
              const parsedDashboard = dashboardDataSchema.parse(dashboard.data);
              const parsedMonthly = z.array(monthlyTransactionSchema).parse(monthly.data ?? []);

              this.patchState({
                dashboardData: parsedDashboard,
                monthlyTransactions: parsedMonthly,
                loading: false
              });
            }),
            catchError(error => {
              this.patchState({ loading: false, error: error instanceof Error ? error.message : 'Dashboard analytics load failed' });
              return EMPTY;
            })
          )
          .subscribe();
      })
    )
  );

  private buildVm(dashboardData: DashboardData | null, monthlyTransactions: MonthlyTransaction[]): DashboardInsightVm | null {
    if (!dashboardData || monthlyTransactions.length === 0) {
      return null;
    }

    const incomeTotal = monthlyTransactions.reduce((sum, item) => sum + item.income, 0);
    const expenseTotal = monthlyTransactions.reduce((sum, item) => sum + item.expense, 0);
    const monthlyAverageIncome = incomeTotal / monthlyTransactions.length;
    const monthlyAverageExpense = expenseTotal / monthlyTransactions.length;
    const savingsRate = monthlyAverageIncome === 0 ? 0 : (monthlyAverageIncome - monthlyAverageExpense) / monthlyAverageIncome;
    const [topExpense] = [...dashboardData.expenseBreakdown].sort((left, right) => right.amount - left.amount);

    const forecastNetWorth = Array.from({ length: 6 }, (_, index) => {
      const month = format(addMonths(new Date(), index + 1), 'yyyy-MM');
      const value = Math.round(dashboardData.netWorth + (monthlyAverageIncome - monthlyAverageExpense) * (index + 1));
      return { month, value };
    });

    return {
      monthlyAverageIncome,
      monthlyAverageExpense,
      savingsRate,
      topExpenseCategory: topExpense?.category ?? '無資料',
      topExpenseAmount: topExpense?.amount ?? 0,
      forecastNetWorth
    };
  }
}