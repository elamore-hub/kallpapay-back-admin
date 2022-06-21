import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISEPABeneficiary } from '../sepa-beneficiary.model';
import { SEPABeneficiaryService } from '../service/sepa-beneficiary.service';
import { SEPABeneficiaryDeleteDialogComponent } from '../delete/sepa-beneficiary-delete-dialog.component';

@Component({
  selector: 'jhi-sepa-beneficiary',
  templateUrl: './sepa-beneficiary.component.html',
})
export class SEPABeneficiaryComponent implements OnInit {
  sEPABeneficiaries?: ISEPABeneficiary[];
  isLoading = false;

  constructor(protected sEPABeneficiaryService: SEPABeneficiaryService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sEPABeneficiaryService.query().subscribe({
      next: (res: HttpResponse<ISEPABeneficiary[]>) => {
        this.isLoading = false;
        this.sEPABeneficiaries = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISEPABeneficiary): number {
    return item.id!;
  }

  delete(sEPABeneficiary: ISEPABeneficiary): void {
    const modalRef = this.modalService.open(SEPABeneficiaryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sEPABeneficiary = sEPABeneficiary;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
