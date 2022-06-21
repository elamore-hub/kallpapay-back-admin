import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMyCause, MyCause } from '../my-cause.model';
import { MyCauseService } from '../service/my-cause.service';

@Injectable({ providedIn: 'root' })
export class MyCauseRoutingResolveService implements Resolve<IMyCause> {
  constructor(protected service: MyCauseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMyCause> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((myCause: HttpResponse<MyCause>) => {
          if (myCause.body) {
            return of(myCause.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MyCause());
  }
}
