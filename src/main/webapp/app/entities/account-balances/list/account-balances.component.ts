import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountBalances } from '../account-balances.model';
import { AccountBalancesService } from '../service/account-balances.service';
import { AccountBalancesDeleteDialogComponent } from '../delete/account-balances-delete-dialog.component';

@Component({
  selector: 'jhi-account-balances',
  templateUrl: './account-balances.component.html',
})
export class AccountBalancesComponent implements OnInit {
  accountBalances?: IAccountBalances[];
  isLoading = false;

  constructor(protected accountBalancesService: AccountBalancesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.accountBalancesService.query().subscribe({
      next: (res: HttpResponse<IAccountBalances[]>) => {
        this.isLoading = false;
        this.accountBalances = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAccountBalances): number {
    return item.id!;
  }

  delete(accountBalances: IAccountBalances): void {
    const modalRef = this.modalService.open(AccountBalancesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accountBalances = accountBalances;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
