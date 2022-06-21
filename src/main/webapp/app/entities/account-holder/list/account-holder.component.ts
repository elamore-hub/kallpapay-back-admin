import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountHolder } from '../account-holder.model';
import { AccountHolderService } from '../service/account-holder.service';
import { AccountHolderDeleteDialogComponent } from '../delete/account-holder-delete-dialog.component';

@Component({
  selector: 'jhi-account-holder',
  templateUrl: './account-holder.component.html',
})
export class AccountHolderComponent implements OnInit {
  accountHolders?: IAccountHolder[];
  isLoading = false;

  constructor(protected accountHolderService: AccountHolderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.accountHolderService.query().subscribe({
      next: (res: HttpResponse<IAccountHolder[]>) => {
        this.isLoading = false;
        this.accountHolders = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAccountHolder): number {
    return item.id!;
  }

  delete(accountHolder: IAccountHolder): void {
    const modalRef = this.modalService.open(AccountHolderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accountHolder = accountHolder;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
