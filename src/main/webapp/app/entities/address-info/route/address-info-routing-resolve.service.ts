import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAddressInfo, AddressInfo } from '../address-info.model';
import { AddressInfoService } from '../service/address-info.service';

@Injectable({ providedIn: 'root' })
export class AddressInfoRoutingResolveService implements Resolve<IAddressInfo> {
  constructor(protected service: AddressInfoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAddressInfo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((addressInfo: HttpResponse<AddressInfo>) => {
          if (addressInfo.body) {
            return of(addressInfo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AddressInfo());
  }
}
