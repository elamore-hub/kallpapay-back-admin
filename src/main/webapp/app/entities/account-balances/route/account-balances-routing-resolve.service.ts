import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccountBalances, AccountBalances } from '../account-balances.model';
import { AccountBalancesService } from '../service/account-balances.service';

@Injectable({ providedIn: 'root' })
export class AccountBalancesRoutingResolveService implements Resolve<IAccountBalances> {
  constructor(protected service: AccountBalancesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountBalances> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountBalances: HttpResponse<AccountBalances>) => {
          if (accountBalances.body) {
            return of(accountBalances.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AccountBalances());
  }
}
