import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IStandingOrder, StandingOrder } from '../standing-order.model';
import { StandingOrderService } from '../service/standing-order.service';
import { IAmount } from 'app/entities/amount/amount.model';
import { AmountService } from 'app/entities/amount/service/amount.service';
import { ISEPABeneficiary } from 'app/entities/sepa-beneficiary/sepa-beneficiary.model';
import { SEPABeneficiaryService } from 'app/entities/sepa-beneficiary/service/sepa-beneficiary.service';

@Component({
  selector: 'jhi-standing-order-update',
  templateUrl: './standing-order-update.component.html',
})
export class StandingOrderUpdateComponent implements OnInit {
  isSaving = false;

  amountsCollection: IAmount[] = [];
  sepaBeneficiariesCollection: ISEPABeneficiary[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    reference: [],
    label: [],
    status: [],
    amount: [],
    sepaBeneficiary: [],
  });

  constructor(
    protected standingOrderService: StandingOrderService,
    protected amountService: AmountService,
    protected sEPABeneficiaryService: SEPABeneficiaryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ standingOrder }) => {
      this.updateForm(standingOrder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const standingOrder = this.createFromForm();
    if (standingOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.standingOrderService.update(standingOrder));
    } else {
      this.subscribeToSaveResponse(this.standingOrderService.create(standingOrder));
    }
  }

  trackAmountById(_index: number, item: IAmount): number {
    return item.id!;
  }

  trackSEPABeneficiaryById(_index: number, item: ISEPABeneficiary): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStandingOrder>>): void {
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

  protected updateForm(standingOrder: IStandingOrder): void {
    this.editForm.patchValue({
      id: standingOrder.id,
      externalId: standingOrder.externalId,
      reference: standingOrder.reference,
      label: standingOrder.label,
      status: standingOrder.status,
      amount: standingOrder.amount,
      sepaBeneficiary: standingOrder.sepaBeneficiary,
    });

    this.amountsCollection = this.amountService.addAmountToCollectionIfMissing(this.amountsCollection, standingOrder.amount);
    this.sepaBeneficiariesCollection = this.sEPABeneficiaryService.addSEPABeneficiaryToCollectionIfMissing(
      this.sepaBeneficiariesCollection,
      standingOrder.sepaBeneficiary
    );
  }

  protected loadRelationshipsOptions(): void {
    this.amountService
      .query({ filter: 'standingorder-is-null' })
      .pipe(map((res: HttpResponse<IAmount[]>) => res.body ?? []))
      .pipe(map((amounts: IAmount[]) => this.amountService.addAmountToCollectionIfMissing(amounts, this.editForm.get('amount')!.value)))
      .subscribe((amounts: IAmount[]) => (this.amountsCollection = amounts));

    this.sEPABeneficiaryService
      .query({ filter: 'standingorder-is-null' })
      .pipe(map((res: HttpResponse<ISEPABeneficiary[]>) => res.body ?? []))
      .pipe(
        map((sEPABeneficiaries: ISEPABeneficiary[]) =>
          this.sEPABeneficiaryService.addSEPABeneficiaryToCollectionIfMissing(
            sEPABeneficiaries,
            this.editForm.get('sepaBeneficiary')!.value
          )
        )
      )
      .subscribe((sEPABeneficiaries: ISEPABeneficiary[]) => (this.sepaBeneficiariesCollection = sEPABeneficiaries));
  }

  protected createFromForm(): IStandingOrder {
    return {
      ...new StandingOrder(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      label: this.editForm.get(['label'])!.value,
      status: this.editForm.get(['status'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      sepaBeneficiary: this.editForm.get(['sepaBeneficiary'])!.value,
    };
  }
}
