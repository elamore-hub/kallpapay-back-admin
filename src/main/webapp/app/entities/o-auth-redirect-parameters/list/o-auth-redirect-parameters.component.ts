import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOAuthRedirectParameters } from '../o-auth-redirect-parameters.model';
import { OAuthRedirectParametersService } from '../service/o-auth-redirect-parameters.service';
import { OAuthRedirectParametersDeleteDialogComponent } from '../delete/o-auth-redirect-parameters-delete-dialog.component';

@Component({
  selector: 'jhi-o-auth-redirect-parameters',
  templateUrl: './o-auth-redirect-parameters.component.html',
})
export class OAuthRedirectParametersComponent implements OnInit {
  oAuthRedirectParameters?: IOAuthRedirectParameters[];
  isLoading = false;

  constructor(protected oAuthRedirectParametersService: OAuthRedirectParametersService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.oAuthRedirectParametersService.query().subscribe({
      next: (res: HttpResponse<IOAuthRedirectParameters[]>) => {
        this.isLoading = false;
        this.oAuthRedirectParameters = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IOAuthRedirectParameters): number {
    return item.id!;
  }

  delete(oAuthRedirectParameters: IOAuthRedirectParameters): void {
    const modalRef = this.modalService.open(OAuthRedirectParametersDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.oAuthRedirectParameters = oAuthRedirectParameters;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
