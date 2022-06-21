import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAmount, Amount } from '../amount.model';
import { AmountService } from '../service/amount.service';

@Component({
  selector: 'jhi-amount-update',
  templateUrl: './amount-update.component.html',
})
export class AmountUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    currency: [],
    value: [],
  });

  constructor(protected amountService: AmountService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ amount }) => {
      this.updateForm(amount);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const amount = this.createFromForm();
    if (amount.id !== undefined) {
      this.subscribeToSaveResponse(this.amountService.update(amount));
    } else {
      this.subscribeToSaveResponse(this.amountService.create(amount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAmount>>): void {
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

  protected updateForm(amount: IAmount): void {
    this.editForm.patchValue({
      id: amount.id,
      currency: amount.currency,
      value: amount.value,
    });
  }

  protected createFromForm(): IAmount {
    return {
      ...new Amount(),
      id: this.editForm.get(['id'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      value: this.editForm.get(['value'])!.value,
    };
  }
}
