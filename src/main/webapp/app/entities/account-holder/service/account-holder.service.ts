import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccountHolder, getAccountHolderIdentifier } from '../account-holder.model';

export type EntityResponseType = HttpResponse<IAccountHolder>;
export type EntityArrayResponseType = HttpResponse<IAccountHolder[]>;

@Injectable({ providedIn: 'root' })
export class AccountHolderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/account-holders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(accountHolder: IAccountHolder): Observable<EntityResponseType> {
    return this.http.post<IAccountHolder>(this.resourceUrl, accountHolder, { observe: 'response' });
  }

  update(accountHolder: IAccountHolder): Observable<EntityResponseType> {
    return this.http.put<IAccountHolder>(`${this.resourceUrl}/${getAccountHolderIdentifier(accountHolder) as number}`, accountHolder, {
      observe: 'response',
    });
  }

  partialUpdate(accountHolder: IAccountHolder): Observable<EntityResponseType> {
    return this.http.patch<IAccountHolder>(`${this.resourceUrl}/${getAccountHolderIdentifier(accountHolder) as number}`, accountHolder, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccountHolder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccountHolder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAccountHolderToCollectionIfMissing(
    accountHolderCollection: IAccountHolder[],
    ...accountHoldersToCheck: (IAccountHolder | null | undefined)[]
  ): IAccountHolder[] {
    const accountHolders: IAccountHolder[] = accountHoldersToCheck.filter(isPresent);
    if (accountHolders.length > 0) {
      const accountHolderCollectionIdentifiers = accountHolderCollection.map(
        accountHolderItem => getAccountHolderIdentifier(accountHolderItem)!
      );
      const accountHoldersToAdd = accountHolders.filter(accountHolderItem => {
        const accountHolderIdentifier = getAccountHolderIdentifier(accountHolderItem);
        if (accountHolderIdentifier == null || accountHolderCollectionIdentifiers.includes(accountHolderIdentifier)) {
          return false;
        }
        accountHolderCollectionIdentifiers.push(accountHolderIdentifier);
        return true;
      });
      return [...accountHoldersToAdd, ...accountHolderCollection];
    }
    return accountHolderCollection;
  }
}
