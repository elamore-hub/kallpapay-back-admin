import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISupportingDocument } from '../supporting-document.model';

@Component({
  selector: 'jhi-supporting-document-detail',
  templateUrl: './supporting-document-detail.component.html',
})
export class SupportingDocumentDetailComponent implements OnInit {
  supportingDocument: ISupportingDocument | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ supportingDocument }) => {
      this.supportingDocument = supportingDocument;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
