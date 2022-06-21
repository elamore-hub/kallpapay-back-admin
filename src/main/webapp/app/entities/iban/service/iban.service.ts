import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIBAN, getIBANIdentifier } from '../iban.model';

export type EntityResponseType = HttpResponse<IIBAN>;
export type EntityArrayResponseType = HttpResponse<IIBAN[]>;

@Injectable({ providedIn: 'root' })
export class IBANService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ibans');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(iBAN: IIBAN): Observable<EntityResponseType> {
    return this.http.post<IIBAN>(this.resourceUrl, iBAN, { observe: 'response' });
  }

  update(iBAN: IIBAN): Observable<EntityResponseType> {
    return this.http.put<IIBAN>(`${this.resourceUrl}/${getIBANIdentifier(iBAN) as number}`, iBAN, { observe: 'response' });
  }

  partialUpdate(iBAN: IIBAN): Observable<EntityResponseType> {
    return this.http.patch<IIBAN>(`${this.resourceUrl}/${getIBANIdentifier(iBAN) as number}`, iBAN, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIBAN>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIBAN[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIBANToCollectionIfMissing(iBANCollection: IIBAN[], ...iBANSToCheck: (IIBAN | null | undefined)[]): IIBAN[] {
    const iBANS: IIBAN[] = iBANSToCheck.filter(isPresent);
    if (iBANS.length > 0) {
      const iBANCollectionIdentifiers = iBANCollection.map(iBANItem => getIBANIdentifier(iBANItem)!);
      const iBANSToAdd = iBANS.filter(iBANItem => {
        const iBANIdentifier = getIBANIdentifier(iBANItem);
        if (iBANIdentifier == null || iBANCollectionIdentifiers.includes(iBANIdentifier)) {
          return false;
        }
        iBANCollectionIdentifiers.push(iBANIdentifier);
        return true;
      });
      return [...iBANSToAdd, ...iBANCollection];
    }
    return iBANCollection;
  }
}
