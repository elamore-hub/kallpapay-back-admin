import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPortfolio, Portfolio } from '../portfolio.model';
import { PortfolioService } from '../service/portfolio.service';

@Injectable({ providedIn: 'root' })
export class PortfolioRoutingResolveService implements Resolve<IPortfolio> {
  constructor(protected service: PortfolioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPortfolio> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((portfolio: HttpResponse<Portfolio>) => {
          if (portfolio.body) {
            return of(portfolio.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Portfolio());
  }
}
