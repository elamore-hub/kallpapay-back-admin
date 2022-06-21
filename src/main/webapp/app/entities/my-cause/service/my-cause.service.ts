import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMyCause, getMyCauseIdentifier } from '../my-cause.model';

export type EntityResponseType = HttpResponse<IMyCause>;
export type EntityArrayResponseType = HttpResponse<IMyCause[]>;

@Injectable({ providedIn: 'root' })
export class MyCauseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/my-causes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(myCause: IMyCause): Observable<EntityResponseType> {
    return this.http.post<IMyCause>(this.resourceUrl, myCause, { observe: 'response' });
  }

  update(myCause: IMyCause): Observable<EntityResponseType> {
    return this.http.put<IMyCause>(`${this.resourceUrl}/${getMyCauseIdentifier(myCause) as number}`, myCause, { observe: 'response' });
  }

  partialUpdate(myCause: IMyCause): Observable<EntityResponseType> {
    return this.http.patch<IMyCause>(`${this.resourceUrl}/${getMyCauseIdentifier(myCause) as number}`, myCause, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMyCause>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMyCause[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMyCauseToCollectionIfMissing(myCauseCollection: IMyCause[], ...myCausesToCheck: (IMyCause | null | undefined)[]): IMyCause[] {
    const myCauses: IMyCause[] = myCausesToCheck.filter(isPresent);
    if (myCauses.length > 0) {
      const myCauseCollectionIdentifiers = myCauseCollection.map(myCauseItem => getMyCauseIdentifier(myCauseItem)!);
      const myCausesToAdd = myCauses.filter(myCauseItem => {
        const myCauseIdentifier = getMyCauseIdentifier(myCauseItem);
        if (myCauseIdentifier == null || myCauseCollectionIdentifiers.includes(myCauseIdentifier)) {
          return false;
        }
        myCauseCollectionIdentifiers.push(myCauseIdentifier);
        return true;
      });
      return [...myCausesToAdd, ...myCauseCollection];
    }
    return myCauseCollection;
  }
}
