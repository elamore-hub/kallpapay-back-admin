import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOnboarding } from '../onboarding.model';
import { OnboardingService } from '../service/onboarding.service';

@Component({
  templateUrl: './onboarding-delete-dialog.component.html',
})
export class OnboardingDeleteDialogComponent {
  onboarding?: IOnboarding;

  constructor(protected onboardingService: OnboardingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.onboardingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
