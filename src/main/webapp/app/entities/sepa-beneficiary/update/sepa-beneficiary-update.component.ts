import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISEPABeneficiary, SEPABeneficiary } from '../sepa-beneficiary.model';
import { SEPABeneficiaryService } from '../service/sepa-beneficiary.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

@Component({
  selector: 'jhi-sepa-beneficiary-update',
  templateUrl: './sepa-beneficiary-update.component.html',
})
export class SEPABeneficiaryUpdateComponent implements OnInit {
  isSaving = false;

  addressesCollection: IAddress[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    name: [],
    isMyOwnIban: [],
    maskedIBAN: [],
    address: [],
  });

  constructor(
    protected sEPABeneficiaryService: SEPABeneficiaryService,
    protected addressService: AddressService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sEPABeneficiary }) => {
      this.updateForm(sEPABeneficiary);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sEPABeneficiary = this.createFromForm();
    if (sEPABeneficiary.id !== undefined) {
      this.subscribeToSaveResponse(this.sEPABeneficiaryService.update(sEPABeneficiary));
    } else {
      this.subscribeToSaveResponse(this.sEPABeneficiaryService.create(sEPABeneficiary));
    }
  }

  trackAddressById(_index: number, item: IAddress): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISEPABeneficiary>>): void {
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

  protected updateForm(sEPABeneficiary: ISEPABeneficiary): void {
    this.editForm.patchValue({
      id: sEPABeneficiary.id,
      externalId: sEPABeneficiary.externalId,
      name: sEPABeneficiary.name,
      isMyOwnIban: sEPABeneficiary.isMyOwnIban,
      maskedIBAN: sEPABeneficiary.maskedIBAN,
      address: sEPABeneficiary.address,
    });

    this.addressesCollection = this.addressService.addAddressToCollectionIfMissing(this.addressesCollection, sEPABeneficiary.address);
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query({ filter: 'sepabeneficiary-is-null' })
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing(addresses, this.editForm.get('address')!.value))
      )
      .subscribe((addresses: IAddress[]) => (this.addressesCollection = addresses));
  }

  protected createFromForm(): ISEPABeneficiary {
    return {
      ...new SEPABeneficiary(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      name: this.editForm.get(['name'])!.value,
      isMyOwnIban: this.editForm.get(['isMyOwnIban'])!.value,
      maskedIBAN: this.editForm.get(['maskedIBAN'])!.value,
      address: this.editForm.get(['address'])!.value,
    };
  }
}
