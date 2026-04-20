import { Routes } from '@angular/router';

export const budgetRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./budget-overview/budget-overview.component').then(m => m.BudgetOverviewComponent)
  },
  {
    path: 'planning',
    loadComponent: () => import('./budget-planning/budget-planning.component').then(m => m.BudgetPlanningComponent)
  },
  {
    path: 'analysis',
    loadComponent: () => import('./budget-analysis/budget-analysis.component').then(m => m.BudgetAnalysisComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./budget-editor/budget-editor.component').then(m => m.BudgetEditorComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./budget-detail/budget-detail.component').then(m => m.BudgetDetailComponent)
  }
];