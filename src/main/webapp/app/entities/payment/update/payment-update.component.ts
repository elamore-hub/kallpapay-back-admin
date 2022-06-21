import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPayment, Payment } from '../payment.model';
import { PaymentService } from '../service/payment.service';
import { IStandingOrder } from 'app/entities/standing-order/standing-order.model';
import { StandingOrderService } from 'app/entities/standing-order/service/standing-order.service';

@Component({
  selector: 'jhi-payment-update',
  templateUrl: './payment-update.component.html',
})
export class PaymentUpdateComponent implements OnInit {
  isSaving = false;

  standingOrdersCollection: IStandingOrder[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    status: [],
    standingOrder: [],
  });

  constructor(
    protected paymentService: PaymentService,
    protected standingOrderService: StandingOrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payment }) => {
      this.updateForm(payment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payment = this.createFromForm();
    if (payment.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentService.update(payment));
    } else {
      this.subscribeToSaveResponse(this.paymentService.create(payment));
    }
  }

  trackStandingOrderById(_index: number, item: IStandingOrder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(payment: IPayment): void {
    this.editForm.patchValue({
      id: payment.id,
      externalId: payment.externalId,
      status: payment.status,
      standingOrder: payment.standingOrder,
    });

    this.standingOrdersCollection = this.standingOrderService.addStandingOrderToCollectionIfMissing(
      this.standingOrdersCollection,
      payment.standingOrder
    );
  }

  protected loadRelationshipsOptions(): void {
    this.standingOrderService
      .query({ filter: 'payment-is-null' })
      .pipe(map((res: HttpResponse<IStandingOrder[]>) => res.body ?? []))
      .pipe(
        map((standingOrders: IStandingOrder[]) =>
          this.standingOrderService.addStandingOrderToCollectionIfMissing(standingOrders, this.editForm.get('standingOrder')!.value)
        )
      )
      .subscribe((standingOrders: IStandingOrder[]) => (this.standingOrdersCollection = standingOrders));
  }

  protected createFromForm(): IPayment {
    return {
      ...new Payment(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      status: this.editForm.get(['status'])!.value,
      standingOrder: this.editForm.get(['standingOrder'])!.value,
    };
  }
}
