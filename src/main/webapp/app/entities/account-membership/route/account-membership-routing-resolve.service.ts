import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccountMembership, AccountMembership } from '../account-membership.model';
import { AccountMembershipService } from '../service/account-membership.service';

@Injectable({ providedIn: 'root' })
export class AccountMembershipRoutingResolveService implements Resolve<IAccountMembership> {
  constructor(protected service: AccountMembershipService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountMembership> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountMembership: HttpResponse<AccountMembership>) => {
          if (accountMembership.body) {
            return of(accountMembership.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AccountMembership());
  }
}
