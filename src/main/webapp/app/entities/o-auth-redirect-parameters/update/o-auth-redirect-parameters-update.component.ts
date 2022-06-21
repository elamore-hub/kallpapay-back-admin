import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IOAuthRedirectParameters, OAuthRedirectParameters } from '../o-auth-redirect-parameters.model';
import { OAuthRedirectParametersService } from '../service/o-auth-redirect-parameters.service';

@Component({
  selector: 'jhi-o-auth-redirect-parameters-update',
  templateUrl: './o-auth-redirect-parameters-update.component.html',
})
export class OAuthRedirectParametersUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    state: [],
    redirectUrl: [],
  });

  constructor(
    protected oAuthRedirectParametersService: OAuthRedirectParametersService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ oAuthRedirectParameters }) => {
      this.updateForm(oAuthRedirectParameters);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const oAuthRedirectParameters = this.createFromForm();
    if (oAuthRedirectParameters.id !== undefined) {
      this.subscribeToSaveResponse(this.oAuthRedirectParametersService.update(oAuthRedirectParameters));
    } else {
      this.subscribeToSaveResponse(this.oAuthRedirectParametersService.create(oAuthRedirectParameters));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOAuthRedirectParameters>>): void {
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

  protected updateForm(oAuthRedirectParameters: IOAuthRedirectParameters): void {
    this.editForm.patchValue({
      id: oAuthRedirectParameters.id,
      state: oAuthRedirectParameters.state,
      redirectUrl: oAuthRedirectParameters.redirectUrl,
    });
  }

  protected createFromForm(): IOAuthRedirectParameters {
    return {
      ...new OAuthRedirectParameters(),
      id: this.editForm.get(['id'])!.value,
      state: this.editForm.get(['state'])!.value,
      redirectUrl: this.editForm.get(['redirectUrl'])!.value,
    };
  }
}
