import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPortfolio } from '../portfolio.model';

@Component({
  selector: 'jhi-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
})
export class PortfolioDetailComponent implements OnInit {
  portfolio: IPortfolio | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ portfolio }) => {
      this.portfolio = portfolio;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
