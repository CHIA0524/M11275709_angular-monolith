import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface BudgetSummary {
  monthlyLimit: number;
  allocated: number;
  spent: number;
  remaining: number;
  utilizationRate: number;
}

export interface BudgetPlan {
  id: string;
  category: string;
  monthlyLimit: number;
  spent: number;
  owner: string;
  period: string;
  status: 'healthy' | 'warning' | 'critical';
}

export interface BudgetFilters {
  keyword: string;
  owner: string;
  status: 'all' | BudgetPlan['status'];
}

export interface BudgetCategoryPerformance {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  suggestion: string;
}

export interface BudgetReviewMilestone {
  id: string;
  title: string;
  dueDate: string;
  owner: string;
  status: 'planned' | 'in-progress' | 'completed';
  note: string;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly plans: BudgetPlan[] = [
    {
      id: 'budget-housing',
      category: '居住成本',
      monthlyLimit: 28000,
      spent: 26500,
      owner: '家庭共用',
      period: '2026-04',
      status: 'warning'
    },
    {
      id: 'budget-food',
      category: '餐飲',
      monthlyLimit: 15000,
      spent: 9800,
      owner: '個人',
      period: '2026-04',
      status: 'healthy'
    },
    {
      id: 'budget-investment',
      category: '投資配置',
      monthlyLimit: 32000,
      spent: 33750,
      owner: '家庭共用',
      period: '2026-04',
      status: 'critical'
    },
    {
      id: 'budget-travel',
      category: '旅遊基金',
      monthlyLimit: 12000,
      spent: 7600,
      owner: '個人',
      period: '2026-04',
      status: 'healthy'
    }
  ];

  private readonly milestones: Record<string, BudgetReviewMilestone[]> = {
    'budget-housing': [
      {
        id: 'milestone-housing-1',
        title: '續租成本檢視',
        dueDate: '2026-04-25',
        owner: '家庭共用',
        status: 'in-progress',
        note: '比較續租與搬遷方案的差異。'
      },
      {
        id: 'milestone-housing-2',
        title: '備用支出池更新',
        dueDate: '2026-04-28',
        owner: 'CHIA',
        status: 'planned',
        note: '保留 8% 給修繕與臨時家用支出。'
      }
    ],
    'budget-food': [
      {
        id: 'milestone-food-1',
        title: '週餐飲上限檢查',
        dueDate: '2026-04-22',
        owner: 'CHIA',
        status: 'completed',
        note: '週檢視後已把外送支出下修。'
      },
      {
        id: 'milestone-food-2',
        title: '聚餐預算拆分',
        dueDate: '2026-04-30',
        owner: 'CHIA',
        status: 'planned',
        note: '將一般飲食與社交餐敘分成兩條預算。'
      }
    ],
    'budget-investment': [
      {
        id: 'milestone-investment-1',
        title: '定期定額上限調整',
        dueDate: '2026-04-24',
        owner: '家庭共用',
        status: 'in-progress',
        note: '避免本月加碼超出資產配置策略。'
      },
      {
        id: 'milestone-investment-2',
        title: '高波動資產檢討',
        dueDate: '2026-05-02',
        owner: 'CHIA',
        status: 'planned',
        note: '重新檢查 ETF 與個股的比例。'
      }
    ],
    'budget-travel': [
      {
        id: 'milestone-travel-1',
        title: '旅遊基金回補排程',
        dueDate: '2026-04-27',
        owner: 'CHIA',
        status: 'planned',
        note: '將本月餘額分兩次補回旅遊基金。'
      }
    ]
  };

  getSummary(): Observable<BudgetSummary> {
    return of({
      monthlyLimit: 125000,
      allocated: 112500,
      spent: 86400,
      remaining: 38600,
      utilizationRate: 76.8
    });
  }

  getPlans(): Observable<BudgetPlan[]> {
    return of(this.plans);
  }

  getPlanById(planId: string): Observable<BudgetPlan | undefined> {
    return of(this.plans.find(plan => plan.id === planId));
  }

  getCategoryPerformance(): Observable<BudgetCategoryPerformance[]> {
    return of([
      {
        category: '固定支出',
        budgeted: 42000,
        actual: 40800,
        variance: 1200,
        suggestion: '維持目前結構，下一期可考慮預留 5% 備用額度。'
      },
      {
        category: '生活支出',
        budgeted: 23000,
        actual: 25150,
        variance: -2150,
        suggestion: '外食與娛樂超支，建議拆出週預算追蹤。'
      },
      {
        category: '投資',
        budgeted: 32000,
        actual: 33750,
        variance: -1750,
        suggestion: '因市場進場加碼偏高，需重新校準自動投入比例。'
      },
      {
        category: '儲蓄目標',
        budgeted: 15500,
        actual: 12700,
        variance: 2800,
        suggestion: '可將本期剩餘額度回補到旅遊或緊急預備金。'
      }
    ]);
  }

  getReviewTimeline(planId: string): Observable<BudgetReviewMilestone[]> {
    return of(this.milestones[planId] ?? []);
  }
}