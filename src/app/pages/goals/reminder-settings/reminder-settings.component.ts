import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { GoalService } from '../../../core/services/goal.service';

@Component({
  selector: 'app-reminder-settings',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule
  ],
  templateUrl: './reminder-settings.component.html',
  styleUrl: './reminder-settings.component.scss'
})
export class ReminderSettingsComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly goalService = inject(GoalService);

  readonly rules$ = this.goalService.getReminderRules();
  readonly displayedColumns = ['name', 'channel', 'cadence', 'scope', 'enabled'];

  readonly reminderForm = this.formBuilder.group({
    name: ['月底預算檢查'],
    channel: ['app'],
    cadence: ['每月月底'],
    scope: ['所有預算類別']
  });
}