import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOnboarding, Onboarding } from '../onboarding.model';
import { OnboardingService } from '../service/onboarding.service';

@Injectable({ providedIn: 'root' })
export class OnboardingRoutingResolveService implements Resolve<IOnboarding> {
  constructor(protected service: OnboardingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOnboarding> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((onboarding: HttpResponse<Onboarding>) => {
          if (onboarding.body) {
            return of(onboarding.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Onboarding());
  }
}
