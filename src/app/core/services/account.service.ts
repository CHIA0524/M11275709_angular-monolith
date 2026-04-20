import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface FinancialAccount {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'investment' | 'credit';
  institution: string;
  currency: string;
  balance: number;
  monthlyChange: number;
  owner: string;
}

export interface AccountActivity {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  direction: 'in' | 'out';
}

export interface CashFlowInsight {
  accountId: string;
  accountName: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  utilization: number;
  recommendation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly accounts: FinancialAccount[] = [
    {
      id: 'acct-checking',
      name: '日常活存帳戶',
      type: 'bank',
      institution: '台灣銀行',
      currency: 'TWD',
      balance: 185000,
      monthlyChange: 12600,
      owner: '個人'
    },
    {
      id: 'acct-brokerage',
      name: '投資證券戶',
      type: 'investment',
      institution: '元大證券',
      currency: 'TWD',
      balance: 642000,
      monthlyChange: 35800,
      owner: '家庭共用'
    },
    {
      id: 'acct-wallet',
      name: '緊急預備金',
      type: 'cash',
      institution: '現金管理',
      currency: 'TWD',
      balance: 58000,
      monthlyChange: -4200,
      owner: '個人'
    },
    {
      id: 'acct-credit',
      name: '信用卡應付帳戶',
      type: 'credit',
      institution: '國泰世華',
      currency: 'TWD',
      balance: -23800,
      monthlyChange: 1800,
      owner: '個人'
    }
  ];

  private readonly activities: Record<string, AccountActivity[]> = {
    'acct-checking': [
      { id: 'act-1', date: '2026-04-15', description: '薪資入帳', category: '收入', amount: 65000, direction: 'in' },
      { id: 'act-2', date: '2026-04-17', description: '房租扣款', category: '居住', amount: 18000, direction: 'out' },
      { id: 'act-3', date: '2026-04-18', description: '生活費轉帳', category: '轉帳', amount: 12000, direction: 'out' }
    ],
    'acct-brokerage': [
      { id: 'act-4', date: '2026-04-12', description: 'ETF 定期定額', category: '投資', amount: 15000, direction: 'out' },
      { id: 'act-5', date: '2026-04-14', description: '股息入帳', category: '收益', amount: 5200, direction: 'in' },
      { id: 'act-6', date: '2026-04-19', description: '再平衡買入', category: '投資', amount: 10000, direction: 'out' }
    ],
    'acct-wallet': [
      { id: 'act-7', date: '2026-04-09', description: '緊急金補足', category: '儲蓄', amount: 5000, direction: 'in' },
      { id: 'act-8', date: '2026-04-16', description: '醫療支出', category: '醫療', amount: 3200, direction: 'out' },
      { id: 'act-9', date: '2026-04-18', description: '家庭備用金移轉', category: '轉帳', amount: 6000, direction: 'out' }
    ],
    'acct-credit': [
      { id: 'act-10', date: '2026-04-08', description: '超市消費', category: '生活', amount: 3200, direction: 'out' },
      { id: 'act-11', date: '2026-04-13', description: '交通支出', category: '交通', amount: 1450, direction: 'out' },
      { id: 'act-12', date: '2026-04-18', description: '帳單繳清', category: '還款', amount: 18000, direction: 'in' }
    ]
  };

  getAccounts(): Observable<FinancialAccount[]> {
    return of(this.accounts);
  }

  getAccountById(accountId: string): Observable<FinancialAccount | undefined> {
    return of(this.accounts.find(account => account.id === accountId));
  }

  getActivities(accountId: string): Observable<AccountActivity[]> {
    return of(this.activities[accountId] ?? []);
  }

  getInsights(): Observable<CashFlowInsight[]> {
    return of([
      {
        accountId: 'acct-checking',
        accountName: '日常活存帳戶',
        inflow: 78000,
        outflow: 61200,
        netFlow: 16800,
        utilization: 68,
        recommendation: '保留兩週營運現金，超過部分可移往投資或高利活存。'
      },
      {
        accountId: 'acct-brokerage',
        accountName: '投資證券戶',
        inflow: 5200,
        outflow: 25000,
        netFlow: -19800,
        utilization: 82,
        recommendation: '投資帳戶現金比偏低，下一期可先補充待投資部位。'
      },
      {
        accountId: 'acct-wallet',
        accountName: '緊急預備金',
        inflow: 5000,
        outflow: 9200,
        netFlow: -4200,
        utilization: 54,
        recommendation: '緊急預備金動用後，建議於兩期內回補。'
      }
    ]);
  }
}