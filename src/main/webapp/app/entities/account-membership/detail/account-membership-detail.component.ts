import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountMembership } from '../account-membership.model';

@Component({
  selector: 'jhi-account-membership-detail',
  templateUrl: './account-membership-detail.component.html',
})
export class AccountMembershipDetailComponent implements OnInit {
  accountMembership: IAccountMembership | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountMembership }) => {
      this.accountMembership = accountMembership;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
