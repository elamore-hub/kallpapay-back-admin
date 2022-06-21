import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountBalances } from '../account-balances.model';

@Component({
  selector: 'jhi-account-balances-detail',
  templateUrl: './account-balances-detail.component.html',
})
export class AccountBalancesDetailComponent implements OnInit {
  accountBalances: IAccountBalances | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountBalances }) => {
      this.accountBalances = accountBalances;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
