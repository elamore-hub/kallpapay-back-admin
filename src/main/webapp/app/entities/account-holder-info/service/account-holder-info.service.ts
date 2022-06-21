import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccountHolderInfo, getAccountHolderInfoIdentifier } from '../account-holder-info.model';

export type EntityResponseType = HttpResponse<IAccountHolderInfo>;
export type EntityArrayResponseType = HttpResponse<IAccountHolderInfo[]>;

@Injectable({ providedIn: 'root' })
export class AccountHolderInfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/account-holder-infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(accountHolderInfo: IAccountHolderInfo): Observable<EntityResponseType> {
    return this.http.post<IAccountHolderInfo>(this.resourceUrl, accountHolderInfo, { observe: 'response' });
  }

  update(accountHolderInfo: IAccountHolderInfo): Observable<EntityResponseType> {
    return this.http.put<IAccountHolderInfo>(
      `${this.resourceUrl}/${getAccountHolderInfoIdentifier(accountHolderInfo) as number}`,
      accountHolderInfo,
      { observe: 'response' }
    );
  }

  partialUpdate(accountHolderInfo: IAccountHolderInfo): Observable<EntityResponseType> {
    return this.http.patch<IAccountHolderInfo>(
      `${this.resourceUrl}/${getAccountHolderInfoIdentifier(accountHolderInfo) as number}`,
      accountHolderInfo,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccountHolderInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccountHolderInfo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAccountHolderInfoToCollectionIfMissing(
    accountHolderInfoCollection: IAccountHolderInfo[],
    ...accountHolderInfosToCheck: (IAccountHolderInfo | null | undefined)[]
  ): IAccountHolderInfo[] {
    const accountHolderInfos: IAccountHolderInfo[] = accountHolderInfosToCheck.filter(isPresent);
    if (accountHolderInfos.length > 0) {
      const accountHolderInfoCollectionIdentifiers = accountHolderInfoCollection.map(
        accountHolderInfoItem => getAccountHolderInfoIdentifier(accountHolderInfoItem)!
      );
      const accountHolderInfosToAdd = accountHolderInfos.filter(accountHolderInfoItem => {
        const accountHolderInfoIdentifier = getAccountHolderInfoIdentifier(accountHolderInfoItem);
        if (accountHolderInfoIdentifier == null || accountHolderInfoCollectionIdentifiers.includes(accountHolderInfoIdentifier)) {
          return false;
        }
        accountHolderInfoCollectionIdentifiers.push(accountHolderInfoIdentifier);
        return true;
      });
      return [...accountHolderInfosToAdd, ...accountHolderInfoCollection];
    }
    return accountHolderInfoCollection;
  }
}
