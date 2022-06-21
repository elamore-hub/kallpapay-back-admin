import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountHolder } from '../account-holder.model';

@Component({
  selector: 'jhi-account-holder-detail',
  templateUrl: './account-holder-detail.component.html',
})
export class AccountHolderDetailComponent implements OnInit {
  accountHolder: IAccountHolder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountHolder }) => {
      this.accountHolder = accountHolder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
