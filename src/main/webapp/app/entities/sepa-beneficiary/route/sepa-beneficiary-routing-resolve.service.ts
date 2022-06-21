import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISEPABeneficiary, SEPABeneficiary } from '../sepa-beneficiary.model';
import { SEPABeneficiaryService } from '../service/sepa-beneficiary.service';

@Injectable({ providedIn: 'root' })
export class SEPABeneficiaryRoutingResolveService implements Resolve<ISEPABeneficiary> {
  constructor(protected service: SEPABeneficiaryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISEPABeneficiary> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sEPABeneficiary: HttpResponse<SEPABeneficiary>) => {
          if (sEPABeneficiary.body) {
            return of(sEPABeneficiary.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SEPABeneficiary());
  }
}
