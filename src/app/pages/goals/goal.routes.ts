import { Routes } from '@angular/router';

export const goalRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./goal-list/goal-list.component').then(m => m.GoalListComponent)
  },
  {
    path: 'reminders',
    loadComponent: () => import('./reminder-settings/reminder-settings.component').then(m => m.ReminderSettingsComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notification-center/notification-center.component').then(m => m.NotificationCenterComponent)
  }
];