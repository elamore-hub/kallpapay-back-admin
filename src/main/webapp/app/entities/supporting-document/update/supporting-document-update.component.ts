import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISupportingDocument, SupportingDocument } from '../supporting-document.model';
import { SupportingDocumentService } from '../service/supporting-document.service';
import { IAccountHolder } from 'app/entities/account-holder/account-holder.model';
import { AccountHolderService } from 'app/entities/account-holder/service/account-holder.service';
import { IOnboarding } from 'app/entities/onboarding/onboarding.model';
import { OnboardingService } from 'app/entities/onboarding/service/onboarding.service';

@Component({
  selector: 'jhi-supporting-document-update',
  templateUrl: './supporting-document-update.component.html',
})
export class SupportingDocumentUpdateComponent implements OnInit {
  isSaving = false;

  accountHoldersSharedCollection: IAccountHolder[] = [];
  onboardingsSharedCollection: IOnboarding[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    status: [],
    supportingDocumentType: [],
    supportingDocumentPurpose: [],
    accountHolder: [],
    onboarding: [],
  });

  constructor(
    protected supportingDocumentService: SupportingDocumentService,
    protected accountHolderService: AccountHolderService,
    protected onboardingService: OnboardingService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ supportingDocument }) => {
      this.updateForm(supportingDocument);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const supportingDocument = this.createFromForm();
    if (supportingDocument.id !== undefined) {
      this.subscribeToSaveResponse(this.supportingDocumentService.update(supportingDocument));
    } else {
      this.subscribeToSaveResponse(this.supportingDocumentService.create(supportingDocument));
    }
  }

  trackAccountHolderById(_index: number, item: IAccountHolder): number {
    return item.id!;
  }

  trackOnboardingById(_index: number, item: IOnboarding): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISupportingDocument>>): void {
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

  protected updateForm(supportingDocument: ISupportingDocument): void {
    this.editForm.patchValue({
      id: supportingDocument.id,
      externalId: supportingDocument.externalId,
      status: supportingDocument.status,
      supportingDocumentType: supportingDocument.supportingDocumentType,
      supportingDocumentPurpose: supportingDocument.supportingDocumentPurpose,
      accountHolder: supportingDocument.accountHolder,
      onboarding: supportingDocument.onboarding,
    });

    this.accountHoldersSharedCollection = this.accountHolderService.addAccountHolderToCollectionIfMissing(
      this.accountHoldersSharedCollection,
      supportingDocument.accountHolder
    );
    this.onboardingsSharedCollection = this.onboardingService.addOnboardingToCollectionIfMissing(
      this.onboardingsSharedCollection,
      supportingDocument.onboarding
    );
  }

  protected loadRelationshipsOptions(): void {
    this.accountHolderService
      .query()
      .pipe(map((res: HttpResponse<IAccountHolder[]>) => res.body ?? []))
      .pipe(
        map((accountHolders: IAccountHolder[]) =>
          this.accountHolderService.addAccountHolderToCollectionIfMissing(accountHolders, this.editForm.get('accountHolder')!.value)
        )
      )
      .subscribe((accountHolders: IAccountHolder[]) => (this.accountHoldersSharedCollection = accountHolders));

    this.onboardingService
      .query()
      .pipe(map((res: HttpResponse<IOnboarding[]>) => res.body ?? []))
      .pipe(
        map((onboardings: IOnboarding[]) =>
          this.onboardingService.addOnboardingToCollectionIfMissing(onboardings, this.editForm.get('onboarding')!.value)
        )
      )
      .subscribe((onboardings: IOnboarding[]) => (this.onboardingsSharedCollection = onboardings));
  }

  protected createFromForm(): ISupportingDocument {
    return {
      ...new SupportingDocument(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      status: this.editForm.get(['status'])!.value,
      supportingDocumentType: this.editForm.get(['supportingDocumentType'])!.value,
      supportingDocumentPurpose: this.editForm.get(['supportingDocumentPurpose'])!.value,
      accountHolder: this.editForm.get(['accountHolder'])!.value,
      onboarding: this.editForm.get(['onboarding'])!.value,
    };
  }
}
