import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAddressInfo } from '../address-info.model';
import { AddressInfoService } from '../service/address-info.service';

@Component({
  templateUrl: './address-info-delete-dialog.component.html',
})
export class AddressInfoDeleteDialogComponent {
  addressInfo?: IAddressInfo;

  constructor(protected addressInfoService: AddressInfoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.addressInfoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
