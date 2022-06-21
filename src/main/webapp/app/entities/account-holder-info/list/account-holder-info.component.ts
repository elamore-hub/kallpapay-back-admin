import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountHolderInfo } from '../account-holder-info.model';
import { AccountHolderInfoService } from '../service/account-holder-info.service';
import { AccountHolderInfoDeleteDialogComponent } from '../delete/account-holder-info-delete-dialog.component';

@Component({
  selector: 'jhi-account-holder-info',
  templateUrl: './account-holder-info.component.html',
})
export class AccountHolderInfoComponent implements OnInit {
  accountHolderInfos?: IAccountHolderInfo[];
  isLoading = false;

  constructor(protected accountHolderInfoService: AccountHolderInfoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.accountHolderInfoService.query().subscribe({
      next: (res: HttpResponse<IAccountHolderInfo[]>) => {
        this.isLoading = false;
        this.accountHolderInfos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAccountHolderInfo): number {
    return item.id!;
  }

  delete(accountHolderInfo: IAccountHolderInfo): void {
    const modalRef = this.modalService.open(AccountHolderInfoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accountHolderInfo = accountHolderInfo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
