import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccountBalances, getAccountBalancesIdentifier } from '../account-balances.model';

export type EntityResponseType = HttpResponse<IAccountBalances>;
export type EntityArrayResponseType = HttpResponse<IAccountBalances[]>;

@Injectable({ providedIn: 'root' })
export class AccountBalancesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/account-balances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(accountBalances: IAccountBalances): Observable<EntityResponseType> {
    return this.http.post<IAccountBalances>(this.resourceUrl, accountBalances, { observe: 'response' });
  }

  update(accountBalances: IAccountBalances): Observable<EntityResponseType> {
    return this.http.put<IAccountBalances>(
      `${this.resourceUrl}/${getAccountBalancesIdentifier(accountBalances) as number}`,
      accountBalances,
      { observe: 'response' }
    );
  }

  partialUpdate(accountBalances: IAccountBalances): Observable<EntityResponseType> {
    return this.http.patch<IAccountBalances>(
      `${this.resourceUrl}/${getAccountBalancesIdentifier(accountBalances) as number}`,
      accountBalances,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccountBalances>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccountBalances[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAccountBalancesToCollectionIfMissing(
    accountBalancesCollection: IAccountBalances[],
    ...accountBalancesToCheck: (IAccountBalances | null | undefined)[]
  ): IAccountBalances[] {
    const accountBalances: IAccountBalances[] = accountBalancesToCheck.filter(isPresent);
    if (accountBalances.length > 0) {
      const accountBalancesCollectionIdentifiers = accountBalancesCollection.map(
        accountBalancesItem => getAccountBalancesIdentifier(accountBalancesItem)!
      );
      const accountBalancesToAdd = accountBalances.filter(accountBalancesItem => {
        const accountBalancesIdentifier = getAccountBalancesIdentifier(accountBalancesItem);
        if (accountBalancesIdentifier == null || accountBalancesCollectionIdentifiers.includes(accountBalancesIdentifier)) {
          return false;
        }
        accountBalancesCollectionIdentifiers.push(accountBalancesIdentifier);
        return true;
      });
      return [...accountBalancesToAdd, ...accountBalancesCollection];
    }
    return accountBalancesCollection;
  }
}
