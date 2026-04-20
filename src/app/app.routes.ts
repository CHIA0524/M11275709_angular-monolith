import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'bookkeeping',
        loadComponent: () => import('./pages/transaction-list/transaction-list.component').then(m => m.TransactionListComponent)
      },
      {
        path: 'bookkeeping/add',
        loadComponent: () => import('./pages/quick-add/quick-add.component').then(m => m.QuickAddComponent)
      },
      {
        path: 'bookkeeping/edit/:id',
        loadComponent: () => import('./pages/quick-add/quick-add.component').then(m => m.QuickAddComponent)
      },
      {
        path: 'transaction-list',
        redirectTo: 'bookkeeping',
      },
      {
        path: 'currency-converter',
        loadComponent: () => import('./pages/currency-converter/currency-converter.component').then(m => m.CurrencyConverterComponent)
      },
      {
        path: 'budgets',
        loadChildren: () => import('./pages/budgets/budget.routes').then(m => m.budgetRoutes)
      },
      {
        path: 'accounts',
        loadChildren: () => import('./pages/accounts/account.routes').then(m => m.accountRoutes)
      },
      {
        path: 'reports',
        loadChildren: () => import('./pages/reports/report.routes').then(m => m.reportRoutes)
      },
      {
        path: 'goals',
        loadChildren: () => import('./pages/goals/goal.routes').then(m => m.goalRoutes)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'benchmark/dashboard',
        loadChildren: () => import('./pages/benchmarks/dashboard/benchmark.routes.generated').then(m => m.benchmarkRoutes)
      },
      {
        path: 'benchmark/bookkeeping',
        loadChildren: () => import('./pages/benchmarks/bookkeeping/benchmark.routes.generated').then(m => m.benchmarkRoutes)
      },
      {
        path: 'benchmark/currency-converter',
        loadChildren: () => import('./pages/benchmarks/currency-converter/benchmark.routes.generated').then(m => m.benchmarkRoutes)
      },
      {
        path: 'benchmark/settings',
        loadChildren: () => import('./pages/benchmarks/settings/benchmark.routes.generated').then(m => m.benchmarkRoutes)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];