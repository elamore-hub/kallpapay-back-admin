import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParticipation, Participation } from '../participation.model';
import { ParticipationService } from '../service/participation.service';

@Injectable({ providedIn: 'root' })
export class ParticipationRoutingResolveService implements Resolve<IParticipation> {
  constructor(protected service: ParticipationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParticipation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((participation: HttpResponse<Participation>) => {
          if (participation.body) {
            return of(participation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Participation());
  }
}
