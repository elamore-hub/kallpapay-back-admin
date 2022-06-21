import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICard, Card } from '../card.model';
import { CardService } from '../service/card.service';
import { IAccountMembership } from 'app/entities/account-membership/account-membership.model';
import { AccountMembershipService } from 'app/entities/account-membership/service/account-membership.service';

@Component({
  selector: 'jhi-card-update',
  templateUrl: './card-update.component.html',
})
export class CardUpdateComponent implements OnInit {
  isSaving = false;

  accountMembershipsSharedCollection: IAccountMembership[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    type: [],
    mainCurrency: [],
    cardDesignUrl: [],
    cardUrl: [],
    status: [],
    expiryDate: [],
    name: [],
    accountMembership: [],
  });

  constructor(
    protected cardService: CardService,
    protected accountMembershipService: AccountMembershipService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ card }) => {
      this.updateForm(card);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const card = this.createFromForm();
    if (card.id !== undefined) {
      this.subscribeToSaveResponse(this.cardService.update(card));
    } else {
      this.subscribeToSaveResponse(this.cardService.create(card));
    }
  }

  trackAccountMembershipById(_index: number, item: IAccountMembership): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICard>>): void {
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

  protected updateForm(card: ICard): void {
    this.editForm.patchValue({
      id: card.id,
      externalId: card.externalId,
      type: card.type,
      mainCurrency: card.mainCurrency,
      cardDesignUrl: card.cardDesignUrl,
      cardUrl: card.cardUrl,
      status: card.status,
      expiryDate: card.expiryDate,
      name: card.name,
      accountMembership: card.accountMembership,
    });

    this.accountMembershipsSharedCollection = this.accountMembershipService.addAccountMembershipToCollectionIfMissing(
      this.accountMembershipsSharedCollection,
      card.accountMembership
    );
  }

  protected loadRelationshipsOptions(): void {
    this.accountMembershipService
      .query()
      .pipe(map((res: HttpResponse<IAccountMembership[]>) => res.body ?? []))
      .pipe(
        map((accountMemberships: IAccountMembership[]) =>
          this.accountMembershipService.addAccountMembershipToCollectionIfMissing(
            accountMemberships,
            this.editForm.get('accountMembership')!.value
          )
        )
      )
      .subscribe((accountMemberships: IAccountMembership[]) => (this.accountMembershipsSharedCollection = accountMemberships));
  }

  protected createFromForm(): ICard {
    return {
      ...new Card(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      type: this.editForm.get(['type'])!.value,
      mainCurrency: this.editForm.get(['mainCurrency'])!.value,
      cardDesignUrl: this.editForm.get(['cardDesignUrl'])!.value,
      cardUrl: this.editForm.get(['cardUrl'])!.value,
      status: this.editForm.get(['status'])!.value,
      expiryDate: this.editForm.get(['expiryDate'])!.value,
      name: this.editForm.get(['name'])!.value,
      accountMembership: this.editForm.get(['accountMembership'])!.value,
    };
  }
}
