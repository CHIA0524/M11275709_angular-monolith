import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgClass, RouterModule, MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent {
  private readonly accountService = inject(AccountService);

  readonly accounts$ = this.accountService.getAccounts();
  readonly displayedColumns = ['name', 'institution', 'currency', 'balance', 'monthlyChange', 'actions'];
}