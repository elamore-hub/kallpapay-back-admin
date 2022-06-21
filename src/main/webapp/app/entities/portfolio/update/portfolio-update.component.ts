import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPortfolio, Portfolio } from '../portfolio.model';
import { PortfolioService } from '../service/portfolio.service';
import { ICard } from 'app/entities/card/card.model';
import { CardService } from 'app/entities/card/service/card.service';
import { Method } from 'app/entities/enumerations/method.model';

@Component({
  selector: 'jhi-portfolio-update',
  templateUrl: './portfolio-update.component.html',
})
export class PortfolioUpdateComponent implements OnInit {
  isSaving = false;
  methodValues = Object.keys(Method);

  cardsSharedCollection: ICard[] = [];

  editForm = this.fb.group({
    id: [],
    limitAmount: [],
    amount: [],
    limitPercentage: [],
    percentage: [],
    method: [],
    card: [],
  });

  constructor(
    protected portfolioService: PortfolioService,
    protected cardService: CardService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ portfolio }) => {
      this.updateForm(portfolio);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const portfolio = this.createFromForm();
    if (portfolio.id !== undefined) {
      this.subscribeToSaveResponse(this.portfolioService.update(portfolio));
    } else {
      this.subscribeToSaveResponse(this.portfolioService.create(portfolio));
    }
  }

  trackCardById(_index: number, item: ICard): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPortfolio>>): void {
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

  protected updateForm(portfolio: IPortfolio): void {
    this.editForm.patchValue({
      id: portfolio.id,
      limitAmount: portfolio.limitAmount,
      amount: portfolio.amount,
      limitPercentage: portfolio.limitPercentage,
      percentage: portfolio.percentage,
      method: portfolio.method,
      card: portfolio.card,
    });

    this.cardsSharedCollection = this.cardService.addCardToCollectionIfMissing(this.cardsSharedCollection, portfolio.card);
  }

  protected loadRelationshipsOptions(): void {
    this.cardService
      .query()
      .pipe(map((res: HttpResponse<ICard[]>) => res.body ?? []))
      .pipe(map((cards: ICard[]) => this.cardService.addCardToCollectionIfMissing(cards, this.editForm.get('card')!.value)))
      .subscribe((cards: ICard[]) => (this.cardsSharedCollection = cards));
  }

  protected createFromForm(): IPortfolio {
    return {
      ...new Portfolio(),
      id: this.editForm.get(['id'])!.value,
      limitAmount: this.editForm.get(['limitAmount'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      limitPercentage: this.editForm.get(['limitPercentage'])!.value,
      percentage: this.editForm.get(['percentage'])!.value,
      method: this.editForm.get(['method'])!.value,
      card: this.editForm.get(['card'])!.value,
    };
  }
}
