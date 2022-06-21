import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISupportingDocument } from '../supporting-document.model';
import { SupportingDocumentService } from '../service/supporting-document.service';
import { SupportingDocumentDeleteDialogComponent } from '../delete/supporting-document-delete-dialog.component';

@Component({
  selector: 'jhi-supporting-document',
  templateUrl: './supporting-document.component.html',
})
export class SupportingDocumentComponent implements OnInit {
  supportingDocuments?: ISupportingDocument[];
  isLoading = false;

  constructor(protected supportingDocumentService: SupportingDocumentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.supportingDocumentService.query().subscribe({
      next: (res: HttpResponse<ISupportingDocument[]>) => {
        this.isLoading = false;
        this.supportingDocuments = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISupportingDocument): number {
    return item.id!;
  }

  delete(supportingDocument: ISupportingDocument): void {
    const modalRef = this.modalService.open(SupportingDocumentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.supportingDocument = supportingDocument;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
