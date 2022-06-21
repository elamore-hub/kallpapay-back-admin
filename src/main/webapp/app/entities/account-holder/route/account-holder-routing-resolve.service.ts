import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccountHolder, AccountHolder } from '../account-holder.model';
import { AccountHolderService } from '../service/account-holder.service';

@Injectable({ providedIn: 'root' })
export class AccountHolderRoutingResolveService implements Resolve<IAccountHolder> {
  constructor(protected service: AccountHolderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountHolder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountHolder: HttpResponse<AccountHolder>) => {
          if (accountHolder.body) {
            return of(accountHolder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AccountHolder());
  }
}
