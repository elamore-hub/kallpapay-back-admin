import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISEPABeneficiary } from '../sepa-beneficiary.model';

@Component({
  selector: 'jhi-sepa-beneficiary-detail',
  templateUrl: './sepa-beneficiary-detail.component.html',
})
export class SEPABeneficiaryDetailComponent implements OnInit {
  sEPABeneficiary: ISEPABeneficiary | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sEPABeneficiary }) => {
      this.sEPABeneficiary = sEPABeneficiary;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
