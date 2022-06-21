import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountMembership } from '../account-membership.model';
import { AccountMembershipService } from '../service/account-membership.service';
import { AccountMembershipDeleteDialogComponent } from '../delete/account-membership-delete-dialog.component';

@Component({
  selector: 'jhi-account-membership',
  templateUrl: './account-membership.component.html',
})
export class AccountMembershipComponent implements OnInit {
  accountMemberships?: IAccountMembership[];
  isLoading = false;

  constructor(protected accountMembershipService: AccountMembershipService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.accountMembershipService.query().subscribe({
      next: (res: HttpResponse<IAccountMembership[]>) => {
        this.isLoading = false;
        this.accountMemberships = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAccountMembership): number {
    return item.id!;
  }

  delete(accountMembership: IAccountMembership): void {
    const modalRef = this.modalService.open(AccountMembershipDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accountMembership = accountMembership;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
