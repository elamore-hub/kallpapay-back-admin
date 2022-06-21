import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMyCause, MyCause } from '../my-cause.model';
import { MyCauseService } from '../service/my-cause.service';
import { ICause } from 'app/entities/cause/cause.model';
import { CauseService } from 'app/entities/cause/service/cause.service';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { PortfolioService } from 'app/entities/portfolio/service/portfolio.service';

@Component({
  selector: 'jhi-my-cause-update',
  templateUrl: './my-cause-update.component.html',
})
export class MyCauseUpdateComponent implements OnInit {
  isSaving = false;

  causesCollection: ICause[] = [];
  portfoliosSharedCollection: IPortfolio[] = [];

  editForm = this.fb.group({
    id: [],
    percentage: [],
    cause: [],
    portfolio: [],
  });

  constructor(
    protected myCauseService: MyCauseService,
    protected causeService: CauseService,
    protected portfolioService: PortfolioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myCause }) => {
      this.updateForm(myCause);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const myCause = this.createFromForm();
    if (myCause.id !== undefined) {
      this.subscribeToSaveResponse(this.myCauseService.update(myCause));
    } else {
      this.subscribeToSaveResponse(this.myCauseService.create(myCause));
    }
  }

  trackCauseById(_index: number, item: ICause): number {
    return item.id!;
  }

  trackPortfolioById(_index: number, item: IPortfolio): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMyCause>>): void {
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

  protected updateForm(myCause: IMyCause): void {
    this.editForm.patchValue({
      id: myCause.id,
      percentage: myCause.percentage,
      cause: myCause.cause,
      portfolio: myCause.portfolio,
    });

    this.causesCollection = this.causeService.addCauseToCollectionIfMissing(this.causesCollection, myCause.cause);
    this.portfoliosSharedCollection = this.portfolioService.addPortfolioToCollectionIfMissing(
      this.portfoliosSharedCollection,
      myCause.portfolio
    );
  }

  protected loadRelationshipsOptions(): void {
    this.causeService
      .query({ filter: 'mycause-is-null' })
      .pipe(map((res: HttpResponse<ICause[]>) => res.body ?? []))
      .pipe(map((causes: ICause[]) => this.causeService.addCauseToCollectionIfMissing(causes, this.editForm.get('cause')!.value)))
      .subscribe((causes: ICause[]) => (this.causesCollection = causes));

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

  protected createFromForm(): IMyCause {
    return {
      ...new MyCause(),
      id: this.editForm.get(['id'])!.value,
      percentage: this.editForm.get(['percentage'])!.value,
      cause: this.editForm.get(['cause'])!.value,
      portfolio: this.editForm.get(['portfolio'])!.value,
    };
  }
}
