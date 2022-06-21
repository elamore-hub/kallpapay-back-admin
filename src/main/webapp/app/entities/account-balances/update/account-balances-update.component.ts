import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAccountBalances, AccountBalances } from '../account-balances.model';
import { AccountBalancesService } from '../service/account-balances.service';
import { IAmount } from 'app/entities/amount/amount.model';
import { AmountService } from 'app/entities/amount/service/amount.service';

@Component({
  selector: 'jhi-account-balances-update',
  templateUrl: './account-balances-update.component.html',
})
export class AccountBalancesUpdateComponent implements OnInit {
  isSaving = false;

  availablesCollection: IAmount[] = [];
  bookedsCollection: IAmount[] = [];
  pendingsCollection: IAmount[] = [];
  reservedsCollection: IAmount[] = [];

  editForm = this.fb.group({
    id: [],
    available: [],
    booked: [],
    pending: [],
    reserved: [],
  });

  constructor(
    protected accountBalancesService: AccountBalancesService,
    protected amountService: AmountService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountBalances }) => {
      this.updateForm(accountBalances);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountBalances = this.createFromForm();
    if (accountBalances.id !== undefined) {
      this.subscribeToSaveResponse(this.accountBalancesService.update(accountBalances));
    } else {
      this.subscribeToSaveResponse(this.accountBalancesService.create(accountBalances));
    }
  }

  trackAmountById(_index: number, item: IAmount): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountBalances>>): void {
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

  protected updateForm(accountBalances: IAccountBalances): void {
    this.editForm.patchValue({
      id: accountBalances.id,
      available: accountBalances.available,
      booked: accountBalances.booked,
      pending: accountBalances.pending,
      reserved: accountBalances.reserved,
    });

    this.availablesCollection = this.amountService.addAmountToCollectionIfMissing(this.availablesCollection, accountBalances.available);
    this.bookedsCollection = this.amountService.addAmountToCollectionIfMissing(this.bookedsCollection, accountBalances.booked);
    this.pendingsCollection = this.amountService.addAmountToCollectionIfMissing(this.pendingsCollection, accountBalances.pending);
    this.reservedsCollection = this.amountService.addAmountToCollectionIfMissing(this.reservedsCollection, accountBalances.reserved);
  }

  protected loadRelationshipsOptions(): void {
    this.amountService
      .query({ filter: 'accountbalances-is-null' })
      .pipe(map((res: HttpResponse<IAmount[]>) => res.body ?? []))
      .pipe(map((amounts: IAmount[]) => this.amountService.addAmountToCollectionIfMissing(amounts, this.editForm.get('available')!.value)))
      .subscribe((amounts: IAmount[]) => (this.availablesCollection = amounts));

    this.amountService
      .query({ filter: 'accountbalances-is-null' })
      .pipe(map((res: HttpResponse<IAmount[]>) => res.body ?? []))
      .pipe(map((amounts: IAmount[]) => this.amountService.addAmountToCollectionIfMissing(amounts, this.editForm.get('booked')!.value)))
      .subscribe((amounts: IAmount[]) => (this.bookedsCollection = amounts));

    this.amountService
      .query({ filter: 'accountbalances-is-null' })
      .pipe(map((res: HttpResponse<IAmount[]>) => res.body ?? []))
      .pipe(map((amounts: IAmount[]) => this.amountService.addAmountToCollectionIfMissing(amounts, this.editForm.get('pending')!.value)))
      .subscribe((amounts: IAmount[]) => (this.pendingsCollection = amounts));

    this.amountService
      .query({ filter: 'accountbalances-is-null' })
      .pipe(map((res: HttpResponse<IAmount[]>) => res.body ?? []))
      .pipe(map((amounts: IAmount[]) => this.amountService.addAmountToCollectionIfMissing(amounts, this.editForm.get('reserved')!.value)))
      .subscribe((amounts: IAmount[]) => (this.reservedsCollection = amounts));
  }

  protected createFromForm(): IAccountBalances {
    return {
      ...new AccountBalances(),
      id: this.editForm.get(['id'])!.value,
      available: this.editForm.get(['available'])!.value,
      booked: this.editForm.get(['booked'])!.value,
      pending: this.editForm.get(['pending'])!.value,
      reserved: this.editForm.get(['reserved'])!.value,
    };
  }
}
