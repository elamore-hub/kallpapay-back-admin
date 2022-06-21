import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOAuthRedirectParameters, OAuthRedirectParameters } from '../o-auth-redirect-parameters.model';
import { OAuthRedirectParametersService } from '../service/o-auth-redirect-parameters.service';

@Injectable({ providedIn: 'root' })
export class OAuthRedirectParametersRoutingResolveService implements Resolve<IOAuthRedirectParameters> {
  constructor(protected service: OAuthRedirectParametersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOAuthRedirectParameters> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((oAuthRedirectParameters: HttpResponse<OAuthRedirectParameters>) => {
          if (oAuthRedirectParameters.body) {
            return of(oAuthRedirectParameters.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OAuthRedirectParameters());
  }
}
