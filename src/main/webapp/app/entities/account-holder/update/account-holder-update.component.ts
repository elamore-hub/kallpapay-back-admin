import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAccountHolder, AccountHolder } from '../account-holder.model';
import { AccountHolderService } from '../service/account-holder.service';
import { IAccountHolderInfo } from 'app/entities/account-holder-info/account-holder-info.model';
import { AccountHolderInfoService } from 'app/entities/account-holder-info/service/account-holder-info.service';
import { IAddressInfo } from 'app/entities/address-info/address-info.model';
import { AddressInfoService } from 'app/entities/address-info/service/address-info.service';

@Component({
  selector: 'jhi-account-holder-update',
  templateUrl: './account-holder-update.component.html',
})
export class AccountHolderUpdateComponent implements OnInit {
  isSaving = false;

  accountHolderInfosCollection: IAccountHolderInfo[] = [];
  residencyAddressesCollection: IAddressInfo[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    verificationStatus: [],
    statusInfo: [],
    accountHolderInfo: [],
    residencyAddress: [],
  });

  constructor(
    protected accountHolderService: AccountHolderService,
    protected accountHolderInfoService: AccountHolderInfoService,
    protected addressInfoService: AddressInfoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountHolder }) => {
      this.updateForm(accountHolder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountHolder = this.createFromForm();
    if (accountHolder.id !== undefined) {
      this.subscribeToSaveResponse(this.accountHolderService.update(accountHolder));
    } else {
      this.subscribeToSaveResponse(this.accountHolderService.create(accountHolder));
    }
  }

  trackAccountHolderInfoById(_index: number, item: IAccountHolderInfo): number {
    return item.id!;
  }

  trackAddressInfoById(_index: number, item: IAddressInfo): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountHolder>>): void {
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

  protected updateForm(accountHolder: IAccountHolder): void {
    this.editForm.patchValue({
      id: accountHolder.id,
      externalId: accountHolder.externalId,
      verificationStatus: accountHolder.verificationStatus,
      statusInfo: accountHolder.statusInfo,
      accountHolderInfo: accountHolder.accountHolderInfo,
      residencyAddress: accountHolder.residencyAddress,
    });

    this.accountHolderInfosCollection = this.accountHolderInfoService.addAccountHolderInfoToCollectionIfMissing(
      this.accountHolderInfosCollection,
      accountHolder.accountHolderInfo
    );
    this.residencyAddressesCollection = this.addressInfoService.addAddressInfoToCollectionIfMissing(
      this.residencyAddressesCollection,
      accountHolder.residencyAddress
    );
  }

  protected loadRelationshipsOptions(): void {
    this.accountHolderInfoService
      .query({ filter: 'accountholder-is-null' })
      .pipe(map((res: HttpResponse<IAccountHolderInfo[]>) => res.body ?? []))
      .pipe(
        map((accountHolderInfos: IAccountHolderInfo[]) =>
          this.accountHolderInfoService.addAccountHolderInfoToCollectionIfMissing(
            accountHolderInfos,
            this.editForm.get('accountHolderInfo')!.value
          )
        )
      )
      .subscribe((accountHolderInfos: IAccountHolderInfo[]) => (this.accountHolderInfosCollection = accountHolderInfos));

    this.addressInfoService
      .query({ filter: 'accountholder-is-null' })
      .pipe(map((res: HttpResponse<IAddressInfo[]>) => res.body ?? []))
      .pipe(
        map((addressInfos: IAddressInfo[]) =>
          this.addressInfoService.addAddressInfoToCollectionIfMissing(addressInfos, this.editForm.get('residencyAddress')!.value)
        )
      )
      .subscribe((addressInfos: IAddressInfo[]) => (this.residencyAddressesCollection = addressInfos));
  }

  protected createFromForm(): IAccountHolder {
    return {
      ...new AccountHolder(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      verificationStatus: this.editForm.get(['verificationStatus'])!.value,
      statusInfo: this.editForm.get(['statusInfo'])!.value,
      accountHolderInfo: this.editForm.get(['accountHolderInfo'])!.value,
      residencyAddress: this.editForm.get(['residencyAddress'])!.value,
    };
  }
}
