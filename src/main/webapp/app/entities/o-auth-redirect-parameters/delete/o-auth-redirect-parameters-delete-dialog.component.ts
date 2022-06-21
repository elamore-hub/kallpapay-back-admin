import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOAuthRedirectParameters } from '../o-auth-redirect-parameters.model';
import { OAuthRedirectParametersService } from '../service/o-auth-redirect-parameters.service';

@Component({
  templateUrl: './o-auth-redirect-parameters-delete-dialog.component.html',
})
export class OAuthRedirectParametersDeleteDialogComponent {
  oAuthRedirectParameters?: IOAuthRedirectParameters;

  constructor(protected oAuthRedirectParametersService: OAuthRedirectParametersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.oAuthRedirectParametersService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
