import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStandingOrder } from '../standing-order.model';
import { StandingOrderService } from '../service/standing-order.service';
import { StandingOrderDeleteDialogComponent } from '../delete/standing-order-delete-dialog.component';

@Component({
  selector: 'jhi-standing-order',
  templateUrl: './standing-order.component.html',
})
export class StandingOrderComponent implements OnInit {
  standingOrders?: IStandingOrder[];
  isLoading = false;

  constructor(protected standingOrderService: StandingOrderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.standingOrderService.query().subscribe({
      next: (res: HttpResponse<IStandingOrder[]>) => {
        this.isLoading = false;
        this.standingOrders = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IStandingOrder): number {
    return item.id!;
  }

  delete(standingOrder: IStandingOrder): void {
    const modalRef = this.modalService.open(StandingOrderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.standingOrder = standingOrder;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
