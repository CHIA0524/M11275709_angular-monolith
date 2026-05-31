import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyWorkspaceStore } from '../currency-workspace.store';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-exchange-history',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, TranslatePipe],
  providers: [CurrencyWorkspaceStore],
  templateUrl: './exchange-history.component.html',
  styleUrl: './exchange-history.component.scss'
})
export class ExchangeHistoryComponent {
  readonly store = inject(CurrencyWorkspaceStore);
  readonly vm$ = this.store.vm$;

  constructor() {
    this.store.load('TWD');
  }
}