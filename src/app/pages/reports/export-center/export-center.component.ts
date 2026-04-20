import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-export-center',
  standalone: true,
  imports: [AsyncPipe, NgClass, RouterModule, MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './export-center.component.html',
  styleUrl: './export-center.component.scss'
})
export class ExportCenterComponent {
  private readonly reportService = inject(ReportService);

  readonly jobs$ = this.reportService.getExportJobs();
  readonly displayedColumns = ['reportName', 'format', 'requestedBy', 'generatedAt', 'status'];
}