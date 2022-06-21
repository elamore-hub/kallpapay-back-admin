import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountHolderInfo } from '../account-holder-info.model';

@Component({
  selector: 'jhi-account-holder-info-detail',
  templateUrl: './account-holder-info-detail.component.html',
})
export class AccountHolderInfoDetailComponent implements OnInit {
  accountHolderInfo: IAccountHolderInfo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountHolderInfo }) => {
      this.accountHolderInfo = accountHolderInfo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
