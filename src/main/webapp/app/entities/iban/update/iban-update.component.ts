import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IIBAN, IBAN } from '../iban.model';
import { IBANService } from '../service/iban.service';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';

@Component({
  selector: 'jhi-iban-update',
  templateUrl: './iban-update.component.html',
})
export class IBANUpdateComponent implements OnInit {
  isSaving = false;

  bankAccountsSharedCollection: IBankAccount[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    iban: [],
    bic: [],
    accountOwner: [],
    bankAccount: [],
  });

  constructor(
    protected iBANService: IBANService,
    protected bankAccountService: BankAccountService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ iBAN }) => {
      this.updateForm(iBAN);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const iBAN = this.createFromForm();
    if (iBAN.id !== undefined) {
      this.subscribeToSaveResponse(this.iBANService.update(iBAN));
    } else {
      this.subscribeToSaveResponse(this.iBANService.create(iBAN));
    }
  }

  trackBankAccountById(_index: number, item: IBankAccount): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIBAN>>): void {
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

  protected updateForm(iBAN: IIBAN): void {
    this.editForm.patchValue({
      id: iBAN.id,
      name: iBAN.name,
      iban: iBAN.iban,
      bic: iBAN.bic,
      accountOwner: iBAN.accountOwner,
      bankAccount: iBAN.bankAccount,
    });

    this.bankAccountsSharedCollection = this.bankAccountService.addBankAccountToCollectionIfMissing(
      this.bankAccountsSharedCollection,
      iBAN.bankAccount
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bankAccountService
      .query()
      .pipe(map((res: HttpResponse<IBankAccount[]>) => res.body ?? []))
      .pipe(
        map((bankAccounts: IBankAccount[]) =>
          this.bankAccountService.addBankAccountToCollectionIfMissing(bankAccounts, this.editForm.get('bankAccount')!.value)
        )
      )
      .subscribe((bankAccounts: IBankAccount[]) => (this.bankAccountsSharedCollection = bankAccounts));
  }

  protected createFromForm(): IIBAN {
    return {
      ...new IBAN(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      iban: this.editForm.get(['iban'])!.value,
      bic: this.editForm.get(['bic'])!.value,
      accountOwner: this.editForm.get(['accountOwner'])!.value,
      bankAccount: this.editForm.get(['bankAccount'])!.value,
    };
  }
}
