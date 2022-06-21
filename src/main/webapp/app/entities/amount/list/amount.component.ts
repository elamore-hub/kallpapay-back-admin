import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAmount } from '../amount.model';
import { AmountService } from '../service/amount.service';
import { AmountDeleteDialogComponent } from '../delete/amount-delete-dialog.component';

@Component({
  selector: 'jhi-amount',
  templateUrl: './amount.component.html',
})
export class AmountComponent implements OnInit {
  amounts?: IAmount[];
  isLoading = false;

  constructor(protected amountService: AmountService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.amountService.query().subscribe({
      next: (res: HttpResponse<IAmount[]>) => {
        this.isLoading = false;
        this.amounts = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAmount): number {
    return item.id!;
  }

  delete(amount: IAmount): void {
    const modalRef = this.modalService.open(AmountDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.amount = amount;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
