import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIBAN } from '../iban.model';

@Component({
  selector: 'jhi-iban-detail',
  templateUrl: './iban-detail.component.html',
})
export class IBANDetailComponent implements OnInit {
  iBAN: IIBAN | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ iBAN }) => {
      this.iBAN = iBAN;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
