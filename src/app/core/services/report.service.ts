import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ReportModule {
  id: string;
  name: string;
  description: string;
  owner: string;
  cadence: string;
  lastGeneratedAt: string;
}

export interface CategoryTrend {
  category: string;
  currentMonth: number;
  previousMonth: number;
  deltaRate: number;
  insight: string;
}

export interface ExportJob {
  id: string;
  reportName: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  requestedBy: string;
  generatedAt: string;
  status: 'completed' | 'queued' | 'failed';
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  getModules(): Observable<ReportModule[]> {
    return of([
      {
        id: 'report-income-expense',
        name: '收支總覽報表',
        description: '整理月收支、變化率與主要波動來源。',
        owner: '財務管理員',
        cadence: '每月',
        lastGeneratedAt: '2026-04-18 08:30'
      },
      {
        id: 'report-category-trend',
        name: '類別趨勢報表',
        description: '比較各支出類別在近兩期的波動。',
        owner: '個人理財',
        cadence: '每週',
        lastGeneratedAt: '2026-04-19 21:10'
      },
      {
        id: 'report-allocation',
        name: '資產配置報表',
        description: '盤點現金、投資與負債的配置比例。',
        owner: '投資檢視',
        cadence: '每月',
        lastGeneratedAt: '2026-04-16 19:40'
      }
    ]);
  }

  getCategoryTrends(): Observable<CategoryTrend[]> {
    return of([
      {
        category: '餐飲',
        currentMonth: 9800,
        previousMonth: 8600,
        deltaRate: 13.9,
        insight: '外食次數上升，建議切回週預算檢視。'
      },
      {
        category: '交通',
        currentMonth: 3200,
        previousMonth: 4200,
        deltaRate: -23.8,
        insight: '通勤成本下降，可能來自遠端工作天數增加。'
      },
      {
        category: '投資',
        currentMonth: 33750,
        previousMonth: 28000,
        deltaRate: 20.5,
        insight: '本期加碼明顯，可與預算模組建立檢核規則。'
      }
    ]);
  }

  getExportJobs(): Observable<ExportJob[]> {
    return of([
      {
        id: 'export-1',
        reportName: '2026 Q1 財務摘要',
        format: 'PDF',
        requestedBy: 'CHIA',
        generatedAt: '2026-04-19 09:40',
        status: 'completed'
      },
      {
        id: 'export-2',
        reportName: '類別趨勢週報',
        format: 'CSV',
        requestedBy: 'CHIA',
        generatedAt: '2026-04-20 07:15',
        status: 'queued'
      },
      {
        id: 'export-3',
        reportName: '投資配置快照',
        format: 'XLSX',
        requestedBy: 'CHIA',
        generatedAt: '2026-04-18 23:10',
        status: 'completed'
      }
    ]);
  }
}