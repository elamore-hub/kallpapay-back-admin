import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStandingOrder } from '../standing-order.model';

@Component({
  selector: 'jhi-standing-order-detail',
  templateUrl: './standing-order-detail.component.html',
})
export class StandingOrderDetailComponent implements OnInit {
  standingOrder: IStandingOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ standingOrder }) => {
      this.standingOrder = standingOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
