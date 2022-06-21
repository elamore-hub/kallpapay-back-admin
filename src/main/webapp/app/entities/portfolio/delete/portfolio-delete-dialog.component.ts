import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPortfolio } from '../portfolio.model';
import { PortfolioService } from '../service/portfolio.service';

@Component({
  templateUrl: './portfolio-delete-dialog.component.html',
})
export class PortfolioDeleteDialogComponent {
  portfolio?: IPortfolio;

  constructor(protected portfolioService: PortfolioService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.portfolioService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
