import { AsyncPipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DashboardAnalysisStore } from '../dashboard-analysis.store';
import { DashboardFacadeService } from '../dashboard-facade.service';

@Component({
  selector: 'app-dashboard-allocation',
  standalone: true,
  imports: [AsyncPipe, PercentPipe, CurrencyPipe, RouterModule, MatButtonModule, MatCardModule],
  providers: [DashboardAnalysisStore, DashboardFacadeService],
  templateUrl: './dashboard-allocation.component.html',
  styleUrl: './dashboard-allocation.component.scss'
})
export class DashboardAllocationComponent {
  readonly facade = inject(DashboardFacadeService);
  readonly allocation$ = this.facade.allocation$;

  constructor() {
    this.facade.load();
  }
}