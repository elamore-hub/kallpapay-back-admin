import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPortfolio } from '../portfolio.model';
import { PortfolioService } from '../service/portfolio.service';
import { PortfolioDeleteDialogComponent } from '../delete/portfolio-delete-dialog.component';

@Component({
  selector: 'jhi-portfolio',
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent implements OnInit {
  portfolios?: IPortfolio[];
  isLoading = false;

  constructor(protected portfolioService: PortfolioService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.portfolioService.query().subscribe({
      next: (res: HttpResponse<IPortfolio[]>) => {
        this.isLoading = false;
        this.portfolios = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPortfolio): number {
    return item.id!;
  }

  delete(portfolio: IPortfolio): void {
    const modalRef = this.modalService.open(PortfolioDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.portfolio = portfolio;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
