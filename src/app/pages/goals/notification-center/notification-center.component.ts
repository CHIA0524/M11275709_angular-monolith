import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GoalService } from '../../../core/services/goal.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [AsyncPipe, NgClass, RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './notification-center.component.html',
  styleUrl: './notification-center.component.scss'
})
export class NotificationCenterComponent {
  private readonly goalService = inject(GoalService);

  readonly notifications$ = this.goalService.getNotifications();
}