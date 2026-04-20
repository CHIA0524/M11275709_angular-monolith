import { AsyncPipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DashboardAnalysisStore } from '../dashboard-analysis.store';

@Component({
  selector: 'app-dashboard-insights',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, PercentPipe, RouterModule, MatButtonModule, MatCardModule],
  providers: [DashboardAnalysisStore],
  templateUrl: './dashboard-insights.component.html',
  styleUrl: './dashboard-insights.component.scss'
})
export class DashboardInsightsComponent {
  readonly store = inject(DashboardAnalysisStore);
  readonly vm$ = this.store.vm$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;

  constructor() {
    this.store.load();
  }
}