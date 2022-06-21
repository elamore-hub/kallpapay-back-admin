import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAmount, getAmountIdentifier } from '../amount.model';

export type EntityResponseType = HttpResponse<IAmount>;
export type EntityArrayResponseType = HttpResponse<IAmount[]>;

@Injectable({ providedIn: 'root' })
export class AmountService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/amounts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(amount: IAmount): Observable<EntityResponseType> {
    return this.http.post<IAmount>(this.resourceUrl, amount, { observe: 'response' });
  }

  update(amount: IAmount): Observable<EntityResponseType> {
    return this.http.put<IAmount>(`${this.resourceUrl}/${getAmountIdentifier(amount) as number}`, amount, { observe: 'response' });
  }

  partialUpdate(amount: IAmount): Observable<EntityResponseType> {
    return this.http.patch<IAmount>(`${this.resourceUrl}/${getAmountIdentifier(amount) as number}`, amount, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAmount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAmount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAmountToCollectionIfMissing(amountCollection: IAmount[], ...amountsToCheck: (IAmount | null | undefined)[]): IAmount[] {
    const amounts: IAmount[] = amountsToCheck.filter(isPresent);
    if (amounts.length > 0) {
      const amountCollectionIdentifiers = amountCollection.map(amountItem => getAmountIdentifier(amountItem)!);
      const amountsToAdd = amounts.filter(amountItem => {
        const amountIdentifier = getAmountIdentifier(amountItem);
        if (amountIdentifier == null || amountCollectionIdentifiers.includes(amountIdentifier)) {
          return false;
        }
        amountCollectionIdentifiers.push(amountIdentifier);
        return true;
      });
      return [...amountsToAdd, ...amountCollection];
    }
    return amountCollection;
  }
}
