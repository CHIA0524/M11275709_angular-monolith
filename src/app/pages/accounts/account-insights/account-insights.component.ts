import { AsyncPipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-account-insights',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, PercentPipe, RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './account-insights.component.html',
  styleUrl: './account-insights.component.scss'
})
export class AccountInsightsComponent {
  private readonly accountService = inject(AccountService);

  readonly insights$ = this.accountService.getInsights();
}