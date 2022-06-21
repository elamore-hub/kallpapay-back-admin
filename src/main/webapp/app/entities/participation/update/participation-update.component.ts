import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IParticipation, Participation } from '../participation.model';
import { ParticipationService } from '../service/participation.service';
import { IAmount } from 'app/entities/amount/amount.model';
import { AmountService } from 'app/entities/amount/service/amount.service';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { PortfolioService } from 'app/entities/portfolio/service/portfolio.service';

@Component({
  selector: 'jhi-participation-update',
  templateUrl: './participation-update.component.html',
})
export class ParticipationUpdateComponent implements OnInit {
  isSaving = false;

  amountsCollection: IAmount[] = [];
  portfoliosSharedCollection: IPortfolio[] = [];

  editForm = this.fb.group({
    id: [],
    creationDate: [],
    amount: [],
    portfolio: [],
  });

  constructor(
    protected participationService: ParticipationService,
    protected amountService: AmountService,
    protected portfolioService: PortfolioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ participation }) => {
      this.updateForm(participation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const participation = this.createFromForm();
    if (participation.id !== undefined) {
      this.subscribeToSaveResponse(this.participationService.update(participation));
    } else {
      this.subscribeToSaveResponse(this.participationService.create(participation));
    }
  }

  trackAmountById(_index: number, item: IAmount): number {
    return item.id!;
  }

  trackPortfolioById(_index: number, item: IPortfolio): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParticipation>>): void {
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

  protected updateForm(participation: IParticipation): void {
    this.editForm.patchValue({
      id: participation.id,
      creationDate: participation.creationDate,
      amount: participation.amount,
      portfolio: participation.portfolio,
    });

    this.amountsCollection = this.amountService.addAmountToCollectionIfMissing(this.amountsCollection, participation.amount);
    this.portfoliosSharedCollection = this.portfolioService.addPortfolioToCollectionIfMissing(
      this.portfoliosSharedCollection,
      participation.portfolio
    );
  }

  protected loadRelationshipsOptions(): void {
    this.amountService
      .query({ filter: 'participation-is-null' })
      .pipe(map((res: HttpResponse<IAmount[]>) => res.body ?? []))
      .pipe(map((amounts: IAmount[]) => this.amountService.addAmountToCollectionIfMissing(amounts, this.editForm.get('amount')!.value)))
      .subscribe((amounts: IAmount[]) => (this.amountsCollection = amounts));

    this.portfolioService
      .query()
      .pipe(map((res: HttpResponse<IPortfolio[]>) => res.body ?? []))
      .pipe(
        map((portfolios: IPortfolio[]) =>
          this.portfolioService.addPortfolioToCollectionIfMissing(portfolios, this.editForm.get('portfolio')!.value)
        )
      )
      .subscribe((portfolios: IPortfolio[]) => (this.portfoliosSharedCollection = portfolios));
  }

  protected createFromForm(): IParticipation {
    return {
      ...new Participation(),
      id: this.editForm.get(['id'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      portfolio: this.editForm.get(['portfolio'])!.value,
    };
  }
}
