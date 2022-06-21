import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAccountMembership, AccountMembership } from '../account-membership.model';
import { AccountMembershipService } from '../service/account-membership.service';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';

@Component({
  selector: 'jhi-account-membership-update',
  templateUrl: './account-membership-update.component.html',
})
export class AccountMembershipUpdateComponent implements OnInit {
  isSaving = false;

  bankAccountsSharedCollection: IBankAccount[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    email: [],
    status: [],
    bankAccount: [],
  });

  constructor(
    protected accountMembershipService: AccountMembershipService,
    protected bankAccountService: BankAccountService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountMembership }) => {
      this.updateForm(accountMembership);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountMembership = this.createFromForm();
    if (accountMembership.id !== undefined) {
      this.subscribeToSaveResponse(this.accountMembershipService.update(accountMembership));
    } else {
      this.subscribeToSaveResponse(this.accountMembershipService.create(accountMembership));
    }
  }

  trackBankAccountById(_index: number, item: IBankAccount): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountMembership>>): void {
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

  protected updateForm(accountMembership: IAccountMembership): void {
    this.editForm.patchValue({
      id: accountMembership.id,
      externalId: accountMembership.externalId,
      email: accountMembership.email,
      status: accountMembership.status,
      bankAccount: accountMembership.bankAccount,
    });

    this.bankAccountsSharedCollection = this.bankAccountService.addBankAccountToCollectionIfMissing(
      this.bankAccountsSharedCollection,
      accountMembership.bankAccount
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

  protected createFromForm(): IAccountMembership {
    return {
      ...new AccountMembership(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      email: this.editForm.get(['email'])!.value,
      status: this.editForm.get(['status'])!.value,
      bankAccount: this.editForm.get(['bankAccount'])!.value,
    };
  }
}
