import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICause, getCauseIdentifier } from '../cause.model';

export type EntityResponseType = HttpResponse<ICause>;
export type EntityArrayResponseType = HttpResponse<ICause[]>;

@Injectable({ providedIn: 'root' })
export class CauseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/causes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cause: ICause): Observable<EntityResponseType> {
    return this.http.post<ICause>(this.resourceUrl, cause, { observe: 'response' });
  }

  update(cause: ICause): Observable<EntityResponseType> {
    return this.http.put<ICause>(`${this.resourceUrl}/${getCauseIdentifier(cause) as number}`, cause, { observe: 'response' });
  }

  partialUpdate(cause: ICause): Observable<EntityResponseType> {
    return this.http.patch<ICause>(`${this.resourceUrl}/${getCauseIdentifier(cause) as number}`, cause, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICause>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICause[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCauseToCollectionIfMissing(causeCollection: ICause[], ...causesToCheck: (ICause | null | undefined)[]): ICause[] {
    const causes: ICause[] = causesToCheck.filter(isPresent);
    if (causes.length > 0) {
      const causeCollectionIdentifiers = causeCollection.map(causeItem => getCauseIdentifier(causeItem)!);
      const causesToAdd = causes.filter(causeItem => {
        const causeIdentifier = getCauseIdentifier(causeItem);
        if (causeIdentifier == null || causeCollectionIdentifiers.includes(causeIdentifier)) {
          return false;
        }
        causeCollectionIdentifiers.push(causeIdentifier);
        return true;
      });
      return [...causesToAdd, ...causeCollection];
    }
    return causeCollection;
  }
}
