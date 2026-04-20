import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterModule, MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss'
})
export class AccountDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly accountService = inject(AccountService);

  readonly displayedColumns = ['date', 'description', 'category', 'amount'];

  readonly viewModel$ = this.route.paramMap.pipe(
    map(params => params.get('id') ?? ''),
    switchMap(accountId => combineLatest({
      account: this.accountService.getAccountById(accountId),
      activities: this.accountService.getActivities(accountId)
    }))
  );
}