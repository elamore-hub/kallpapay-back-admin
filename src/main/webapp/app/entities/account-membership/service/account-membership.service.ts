import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccountMembership, getAccountMembershipIdentifier } from '../account-membership.model';

export type EntityResponseType = HttpResponse<IAccountMembership>;
export type EntityArrayResponseType = HttpResponse<IAccountMembership[]>;

@Injectable({ providedIn: 'root' })
export class AccountMembershipService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/account-memberships');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(accountMembership: IAccountMembership): Observable<EntityResponseType> {
    return this.http.post<IAccountMembership>(this.resourceUrl, accountMembership, { observe: 'response' });
  }

  update(accountMembership: IAccountMembership): Observable<EntityResponseType> {
    return this.http.put<IAccountMembership>(
      `${this.resourceUrl}/${getAccountMembershipIdentifier(accountMembership) as number}`,
      accountMembership,
      { observe: 'response' }
    );
  }

  partialUpdate(accountMembership: IAccountMembership): Observable<EntityResponseType> {
    return this.http.patch<IAccountMembership>(
      `${this.resourceUrl}/${getAccountMembershipIdentifier(accountMembership) as number}`,
      accountMembership,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccountMembership>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccountMembership[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAccountMembershipToCollectionIfMissing(
    accountMembershipCollection: IAccountMembership[],
    ...accountMembershipsToCheck: (IAccountMembership | null | undefined)[]
  ): IAccountMembership[] {
    const accountMemberships: IAccountMembership[] = accountMembershipsToCheck.filter(isPresent);
    if (accountMemberships.length > 0) {
      const accountMembershipCollectionIdentifiers = accountMembershipCollection.map(
        accountMembershipItem => getAccountMembershipIdentifier(accountMembershipItem)!
      );
      const accountMembershipsToAdd = accountMemberships.filter(accountMembershipItem => {
        const accountMembershipIdentifier = getAccountMembershipIdentifier(accountMembershipItem);
        if (accountMembershipIdentifier == null || accountMembershipCollectionIdentifiers.includes(accountMembershipIdentifier)) {
          return false;
        }
        accountMembershipCollectionIdentifiers.push(accountMembershipIdentifier);
        return true;
      });
      return [...accountMembershipsToAdd, ...accountMembershipCollection];
    }
    return accountMembershipCollection;
  }
}
