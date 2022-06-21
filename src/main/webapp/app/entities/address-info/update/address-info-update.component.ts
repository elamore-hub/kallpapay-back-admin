import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAddressInfo, AddressInfo } from '../address-info.model';
import { AddressInfoService } from '../service/address-info.service';

@Component({
  selector: 'jhi-address-info-update',
  templateUrl: './address-info-update.component.html',
})
export class AddressInfoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected addressInfoService: AddressInfoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ addressInfo }) => {
      this.updateForm(addressInfo);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const addressInfo = this.createFromForm();
    if (addressInfo.id !== undefined) {
      this.subscribeToSaveResponse(this.addressInfoService.update(addressInfo));
    } else {
      this.subscribeToSaveResponse(this.addressInfoService.create(addressInfo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAddressInfo>>): void {
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

  protected updateForm(addressInfo: IAddressInfo): void {
    this.editForm.patchValue({
      id: addressInfo.id,
      name: addressInfo.name,
    });
  }

  protected createFromForm(): IAddressInfo {
    return {
      ...new AddressInfo(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
