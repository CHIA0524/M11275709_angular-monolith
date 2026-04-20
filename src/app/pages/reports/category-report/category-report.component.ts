import { AsyncPipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-category-report',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, PercentPipe, RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './category-report.component.html',
  styleUrl: './category-report.component.scss'
})
export class CategoryReportComponent {
  private readonly reportService = inject(ReportService);

  readonly trends$ = this.reportService.getCategoryTrends();
}