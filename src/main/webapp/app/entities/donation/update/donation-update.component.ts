import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDonation, Donation } from '../donation.model';
import { DonationService } from '../service/donation.service';
import { IMyCause } from 'app/entities/my-cause/my-cause.model';
import { MyCauseService } from 'app/entities/my-cause/service/my-cause.service';

@Component({
  selector: 'jhi-donation-update',
  templateUrl: './donation-update.component.html',
})
export class DonationUpdateComponent implements OnInit {
  isSaving = false;

  myCausesSharedCollection: IMyCause[] = [];

  editForm = this.fb.group({
    id: [],
    myCause: [],
  });

  constructor(
    protected donationService: DonationService,
    protected myCauseService: MyCauseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ donation }) => {
      this.updateForm(donation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const donation = this.createFromForm();
    if (donation.id !== undefined) {
      this.subscribeToSaveResponse(this.donationService.update(donation));
    } else {
      this.subscribeToSaveResponse(this.donationService.create(donation));
    }
  }

  trackMyCauseById(_index: number, item: IMyCause): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDonation>>): void {
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

  protected updateForm(donation: IDonation): void {
    this.editForm.patchValue({
      id: donation.id,
      myCause: donation.myCause,
    });

    this.myCausesSharedCollection = this.myCauseService.addMyCauseToCollectionIfMissing(this.myCausesSharedCollection, donation.myCause);
  }

  protected loadRelationshipsOptions(): void {
    this.myCauseService
      .query()
      .pipe(map((res: HttpResponse<IMyCause[]>) => res.body ?? []))
      .pipe(
        map((myCauses: IMyCause[]) => this.myCauseService.addMyCauseToCollectionIfMissing(myCauses, this.editForm.get('myCause')!.value))
      )
      .subscribe((myCauses: IMyCause[]) => (this.myCausesSharedCollection = myCauses));
  }

  protected createFromForm(): IDonation {
    return {
      ...new Donation(),
      id: this.editForm.get(['id'])!.value,
      myCause: this.editForm.get(['myCause'])!.value,
    };
  }
}
