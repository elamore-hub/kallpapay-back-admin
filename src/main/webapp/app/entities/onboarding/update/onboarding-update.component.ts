import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOnboarding, Onboarding } from '../onboarding.model';
import { OnboardingService } from '../service/onboarding.service';
import { IAccountHolder } from 'app/entities/account-holder/account-holder.model';
import { AccountHolderService } from 'app/entities/account-holder/service/account-holder.service';
import { IOAuthRedirectParameters } from 'app/entities/o-auth-redirect-parameters/o-auth-redirect-parameters.model';
import { OAuthRedirectParametersService } from 'app/entities/o-auth-redirect-parameters/service/o-auth-redirect-parameters.service';

@Component({
  selector: 'jhi-onboarding-update',
  templateUrl: './onboarding-update.component.html',
})
export class OnboardingUpdateComponent implements OnInit {
  isSaving = false;

  accountHoldersCollection: IAccountHolder[] = [];
  oAuthRedirectParametersCollection: IOAuthRedirectParameters[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    accountName: [],
    email: [],
    language: [],
    accountHolderType: [],
    onboardingUrl: [],
    onboardingState: [],
    redirectUrl: [],
    status: [],
    tcuUrl: [],
    accountHolder: [],
    oAuthRedirectParameters: [],
  });

  constructor(
    protected onboardingService: OnboardingService,
    protected accountHolderService: AccountHolderService,
    protected oAuthRedirectParametersService: OAuthRedirectParametersService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ onboarding }) => {
      this.updateForm(onboarding);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const onboarding = this.createFromForm();
    if (onboarding.id !== undefined) {
      this.subscribeToSaveResponse(this.onboardingService.update(onboarding));
    } else {
      this.subscribeToSaveResponse(this.onboardingService.create(onboarding));
    }
  }

  trackAccountHolderById(_index: number, item: IAccountHolder): number {
    return item.id!;
  }

  trackOAuthRedirectParametersById(_index: number, item: IOAuthRedirectParameters): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOnboarding>>): void {
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

  protected updateForm(onboarding: IOnboarding): void {
    this.editForm.patchValue({
      id: onboarding.id,
      externalId: onboarding.externalId,
      accountName: onboarding.accountName,
      email: onboarding.email,
      language: onboarding.language,
      accountHolderType: onboarding.accountHolderType,
      onboardingUrl: onboarding.onboardingUrl,
      onboardingState: onboarding.onboardingState,
      redirectUrl: onboarding.redirectUrl,
      status: onboarding.status,
      tcuUrl: onboarding.tcuUrl,
      accountHolder: onboarding.accountHolder,
      oAuthRedirectParameters: onboarding.oAuthRedirectParameters,
    });

    this.accountHoldersCollection = this.accountHolderService.addAccountHolderToCollectionIfMissing(
      this.accountHoldersCollection,
      onboarding.accountHolder
    );
    this.oAuthRedirectParametersCollection = this.oAuthRedirectParametersService.addOAuthRedirectParametersToCollectionIfMissing(
      this.oAuthRedirectParametersCollection,
      onboarding.oAuthRedirectParameters
    );
  }

  protected loadRelationshipsOptions(): void {
    this.accountHolderService
      .query({ filter: 'onboarding-is-null' })
      .pipe(map((res: HttpResponse<IAccountHolder[]>) => res.body ?? []))
      .pipe(
        map((accountHolders: IAccountHolder[]) =>
          this.accountHolderService.addAccountHolderToCollectionIfMissing(accountHolders, this.editForm.get('accountHolder')!.value)
        )
      )
      .subscribe((accountHolders: IAccountHolder[]) => (this.accountHoldersCollection = accountHolders));

    this.oAuthRedirectParametersService
      .query({ filter: 'onboarding-is-null' })
      .pipe(map((res: HttpResponse<IOAuthRedirectParameters[]>) => res.body ?? []))
      .pipe(
        map((oAuthRedirectParameters: IOAuthRedirectParameters[]) =>
          this.oAuthRedirectParametersService.addOAuthRedirectParametersToCollectionIfMissing(
            oAuthRedirectParameters,
            this.editForm.get('oAuthRedirectParameters')!.value
          )
        )
      )
      .subscribe(
        (oAuthRedirectParameters: IOAuthRedirectParameters[]) => (this.oAuthRedirectParametersCollection = oAuthRedirectParameters)
      );
  }

  protected createFromForm(): IOnboarding {
    return {
      ...new Onboarding(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      accountName: this.editForm.get(['accountName'])!.value,
      email: this.editForm.get(['email'])!.value,
      language: this.editForm.get(['language'])!.value,
      accountHolderType: this.editForm.get(['accountHolderType'])!.value,
      onboardingUrl: this.editForm.get(['onboardingUrl'])!.value,
      onboardingState: this.editForm.get(['onboardingState'])!.value,
      redirectUrl: this.editForm.get(['redirectUrl'])!.value,
      status: this.editForm.get(['status'])!.value,
      tcuUrl: this.editForm.get(['tcuUrl'])!.value,
      accountHolder: this.editForm.get(['accountHolder'])!.value,
      oAuthRedirectParameters: this.editForm.get(['oAuthRedirectParameters'])!.value,
    };
  }
}
