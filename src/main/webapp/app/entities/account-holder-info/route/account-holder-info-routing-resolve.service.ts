import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccountHolderInfo, AccountHolderInfo } from '../account-holder-info.model';
import { AccountHolderInfoService } from '../service/account-holder-info.service';

@Injectable({ providedIn: 'root' })
export class AccountHolderInfoRoutingResolveService implements Resolve<IAccountHolderInfo> {
  constructor(protected service: AccountHolderInfoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountHolderInfo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountHolderInfo: HttpResponse<AccountHolderInfo>) => {
          if (accountHolderInfo.body) {
            return of(accountHolderInfo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AccountHolderInfo());
  }
}
