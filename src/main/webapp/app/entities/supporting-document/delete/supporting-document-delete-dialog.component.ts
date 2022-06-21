import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISupportingDocument } from '../supporting-document.model';
import { SupportingDocumentService } from '../service/supporting-document.service';

@Component({
  templateUrl: './supporting-document-delete-dialog.component.html',
})
export class SupportingDocumentDeleteDialogComponent {
  supportingDocument?: ISupportingDocument;

  constructor(protected supportingDocumentService: SupportingDocumentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.supportingDocumentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
