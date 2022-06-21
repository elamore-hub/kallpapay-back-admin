import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStandingOrder, StandingOrder } from '../standing-order.model';
import { StandingOrderService } from '../service/standing-order.service';

@Injectable({ providedIn: 'root' })
export class StandingOrderRoutingResolveService implements Resolve<IStandingOrder> {
  constructor(protected service: StandingOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStandingOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((standingOrder: HttpResponse<StandingOrder>) => {
          if (standingOrder.body) {
            return of(standingOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StandingOrder());
  }
}
