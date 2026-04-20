import { AsyncPipe, CurrencyPipe, PercentPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GoalService } from '../../../core/services/goal.service';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, PercentPipe, NgClass, RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './goal-list.component.html',
  styleUrl: './goal-list.component.scss'
})
export class GoalListComponent {
  private readonly goalService = inject(GoalService);

  readonly goals$ = this.goalService.getGoals();
}