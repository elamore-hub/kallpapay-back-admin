import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISupportingDocument, SupportingDocument } from '../supporting-document.model';
import { SupportingDocumentService } from '../service/supporting-document.service';

@Injectable({ providedIn: 'root' })
export class SupportingDocumentRoutingResolveService implements Resolve<ISupportingDocument> {
  constructor(protected service: SupportingDocumentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISupportingDocument> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((supportingDocument: HttpResponse<SupportingDocument>) => {
          if (supportingDocument.body) {
            return of(supportingDocument.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SupportingDocument());
  }
}
