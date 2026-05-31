import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';

export interface ProjectionRow {
  month: string | number;
  conservative: number;
  optimistic: number;
  stress: number;
}

@Component({
  selector: 'app-projection-table',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './projection-table.component.html',
  styleUrl: './projection-table.component.scss'
})
export class ProjectionTableComponent {
  readonly rows = input.required<ProjectionRow[]>();
}