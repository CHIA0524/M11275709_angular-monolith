import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-report-center',
  standalone: true,
  imports: [AsyncPipe, RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './report-center.component.html',
  styleUrl: './report-center.component.scss'
})
export class ReportCenterComponent {
  private readonly reportService = inject(ReportService);

  readonly modules$ = this.reportService.getModules();
}