import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOnboarding } from '../onboarding.model';
import { OnboardingService } from '../service/onboarding.service';
import { OnboardingDeleteDialogComponent } from '../delete/onboarding-delete-dialog.component';

@Component({
  selector: 'jhi-onboarding',
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent implements OnInit {
  onboardings?: IOnboarding[];
  isLoading = false;

  constructor(protected onboardingService: OnboardingService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.onboardingService.query().subscribe({
      next: (res: HttpResponse<IOnboarding[]>) => {
        this.isLoading = false;
        this.onboardings = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IOnboarding): number {
    return item.id!;
  }

  delete(onboarding: IOnboarding): void {
    const modalRef = this.modalService.open(OnboardingDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.onboarding = onboarding;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
