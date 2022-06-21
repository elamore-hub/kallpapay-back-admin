import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIBAN, IBAN } from '../iban.model';
import { IBANService } from '../service/iban.service';

@Injectable({ providedIn: 'root' })
export class IBANRoutingResolveService implements Resolve<IIBAN> {
  constructor(protected service: IBANService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIBAN> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((iBAN: HttpResponse<IBAN>) => {
          if (iBAN.body) {
            return of(iBAN.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new IBAN());
  }
}
