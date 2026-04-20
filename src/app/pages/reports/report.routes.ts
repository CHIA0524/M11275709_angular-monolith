import { Routes } from '@angular/router';

export const reportRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./report-center/report-center.component').then(m => m.ReportCenterComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./category-report/category-report.component').then(m => m.CategoryReportComponent)
  },
  {
    path: 'exports',
    loadComponent: () => import('./export-center/export-center.component').then(m => m.ExportCenterComponent)
  }
];