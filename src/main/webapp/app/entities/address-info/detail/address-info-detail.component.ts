import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAddressInfo } from '../address-info.model';

@Component({
  selector: 'jhi-address-info-detail',
  templateUrl: './address-info-detail.component.html',
})
export class AddressInfoDetailComponent implements OnInit {
  addressInfo: IAddressInfo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ addressInfo }) => {
      this.addressInfo = addressInfo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
