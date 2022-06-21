import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICause, Cause } from '../cause.model';
import { CauseService } from '../service/cause.service';

@Injectable({ providedIn: 'root' })
export class CauseRoutingResolveService implements Resolve<ICause> {
  constructor(protected service: CauseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICause> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cause: HttpResponse<Cause>) => {
          if (cause.body) {
            return of(cause.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Cause());
  }
}
