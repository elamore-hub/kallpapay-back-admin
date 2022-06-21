import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAddressInfo } from '../address-info.model';
import { AddressInfoService } from '../service/address-info.service';
import { AddressInfoDeleteDialogComponent } from '../delete/address-info-delete-dialog.component';

@Component({
  selector: 'jhi-address-info',
  templateUrl: './address-info.component.html',
})
export class AddressInfoComponent implements OnInit {
  addressInfos?: IAddressInfo[];
  isLoading = false;

  constructor(protected addressInfoService: AddressInfoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.addressInfoService.query().subscribe({
      next: (res: HttpResponse<IAddressInfo[]>) => {
        this.isLoading = false;
        this.addressInfos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAddressInfo): number {
    return item.id!;
  }

  delete(addressInfo: IAddressInfo): void {
    const modalRef = this.modalService.open(AddressInfoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.addressInfo = addressInfo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
