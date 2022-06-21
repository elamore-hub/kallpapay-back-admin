import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIBAN } from '../iban.model';
import { IBANService } from '../service/iban.service';
import { IBANDeleteDialogComponent } from '../delete/iban-delete-dialog.component';

@Component({
  selector: 'jhi-iban',
  templateUrl: './iban.component.html',
})
export class IBANComponent implements OnInit {
  iBANS?: IIBAN[];
  isLoading = false;

  constructor(protected iBANService: IBANService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.iBANService.query().subscribe({
      next: (res: HttpResponse<IIBAN[]>) => {
        this.isLoading = false;
        this.iBANS = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IIBAN): number {
    return item.id!;
  }

  delete(iBAN: IIBAN): void {
    const modalRef = this.modalService.open(IBANDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.iBAN = iBAN;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
