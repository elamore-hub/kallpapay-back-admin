import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAccountHolderInfo, AccountHolderInfo } from '../account-holder-info.model';
import { AccountHolderInfoService } from '../service/account-holder-info.service';

@Component({
  selector: 'jhi-account-holder-info-update',
  templateUrl: './account-holder-info-update.component.html',
})
export class AccountHolderInfoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    type: [],
    name: [],
  });

  constructor(
    protected accountHolderInfoService: AccountHolderInfoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountHolderInfo }) => {
      this.updateForm(accountHolderInfo);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountHolderInfo = this.createFromForm();
    if (accountHolderInfo.id !== undefined) {
      this.subscribeToSaveResponse(this.accountHolderInfoService.update(accountHolderInfo));
    } else {
      this.subscribeToSaveResponse(this.accountHolderInfoService.create(accountHolderInfo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountHolderInfo>>): void {
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

  protected updateForm(accountHolderInfo: IAccountHolderInfo): void {
    this.editForm.patchValue({
      id: accountHolderInfo.id,
      type: accountHolderInfo.type,
      name: accountHolderInfo.name,
    });
  }

  protected createFromForm(): IAccountHolderInfo {
    return {
      ...new AccountHolderInfo(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
