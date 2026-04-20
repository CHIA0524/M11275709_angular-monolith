import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ReminderRule {
  id: string;
  name: string;
  channel: 'app' | 'email';
  cadence: string;
  scope: string;
  enabled: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  severity: 'info' | 'warning' | 'critical';
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  getGoals(): Observable<FinancialGoal[]> {
    return of([
      {
        id: 'goal-emergency-fund',
        title: '緊急預備金 6 個月',
        targetAmount: 360000,
        currentAmount: 228000,
        dueDate: '2026-12-31',
        priority: 'high'
      },
      {
        id: 'goal-travel',
        title: '日本旅遊基金',
        targetAmount: 120000,
        currentAmount: 46000,
        dueDate: '2027-03-15',
        priority: 'medium'
      },
      {
        id: 'goal-down-payment',
        title: '購屋頭期款',
        targetAmount: 1500000,
        currentAmount: 540000,
        dueDate: '2028-06-30',
        priority: 'high'
      }
    ]);
  }

  getReminderRules(): Observable<ReminderRule[]> {
    return of([
      {
        id: 'rule-budget-review',
        name: '預算超支提醒',
        channel: 'app',
        cadence: '每週一',
        scope: '生活支出',
        enabled: true
      },
      {
        id: 'rule-card-bill',
        name: '信用卡帳單提醒',
        channel: 'email',
        cadence: '每月 25 日',
        scope: '信用卡應付帳戶',
        enabled: true
      },
      {
        id: 'rule-goal-check',
        name: '儲蓄進度檢查',
        channel: 'app',
        cadence: '每月月底',
        scope: '所有財務目標',
        enabled: false
      }
    ]);
  }

  getNotifications(): Observable<NotificationItem[]> {
    return of([
      {
        id: 'notice-1',
        title: '生活支出接近月上限',
        message: '目前已使用 92%，建議延後非必要支出。',
        createdAt: '2026-04-19 18:20',
        severity: 'warning',
        source: '預算管理'
      },
      {
        id: 'notice-2',
        title: '信用卡帳單即將到期',
        message: '請於 4/25 前完成繳款，避免產生循環利息。',
        createdAt: '2026-04-20 09:00',
        severity: 'critical',
        source: '提醒中心'
      },
      {
        id: 'notice-3',
        title: '旅遊基金進度更新',
        message: '本月已新增 8,000 元，距離下一里程碑剩餘 6,000 元。',
        createdAt: '2026-04-18 11:40',
        severity: 'info',
        source: '財務目標'
      }
    ]);
  }
}