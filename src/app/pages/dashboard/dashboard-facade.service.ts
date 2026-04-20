import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { DashboardAnalysisStore } from './dashboard-analysis.store';

export interface AllocationSlice {
  category: string;
  amount: number;
  ratio: number;
  recommendation: string;
}

@Injectable()
export class DashboardFacadeService {
  private readonly analysisStore = inject(DashboardAnalysisStore);

  readonly vm$ = this.analysisStore.vm$;
  readonly loading$ = this.analysisStore.loading$;
  readonly error$ = this.analysisStore.error$;
  readonly allocation$ = this.vm$.pipe(
    map(vm => {
      if (!vm) {
        return [] as AllocationSlice[];
      }

      const total = vm.topExpenseAmount + vm.monthlyAverageIncome + vm.monthlyAverageExpense;
      const slices: Array<{ category: string; amount: number }> = [
        { category: '收入緩衝', amount: vm.monthlyAverageIncome },
        { category: '支出承壓', amount: vm.monthlyAverageExpense },
        { category: '高關注類別', amount: vm.topExpenseAmount }
      ];

      return slices.map(slice => ({
        ...slice,
        ratio: total === 0 ? 0 : slice.amount / total,
        recommendation: slice.category === '支出承壓'
          ? '優先控制支出波動，避免拖累年度淨值成長。'
          : slice.category === '高關注類別'
            ? '對最高支出類別做逐項拆解，確認是否有一次性因素。'
            : '保留收入緩衝能提升情境模擬的穩定度。'
      }));
    })
  );

  load(): void {
    this.analysisStore.load();
  }
}