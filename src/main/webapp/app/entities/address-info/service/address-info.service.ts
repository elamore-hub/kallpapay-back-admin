import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAddressInfo, getAddressInfoIdentifier } from '../address-info.model';

export type EntityResponseType = HttpResponse<IAddressInfo>;
export type EntityArrayResponseType = HttpResponse<IAddressInfo[]>;

@Injectable({ providedIn: 'root' })
export class AddressInfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/address-infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(addressInfo: IAddressInfo): Observable<EntityResponseType> {
    return this.http.post<IAddressInfo>(this.resourceUrl, addressInfo, { observe: 'response' });
  }

  update(addressInfo: IAddressInfo): Observable<EntityResponseType> {
    return this.http.put<IAddressInfo>(`${this.resourceUrl}/${getAddressInfoIdentifier(addressInfo) as number}`, addressInfo, {
      observe: 'response',
    });
  }

  partialUpdate(addressInfo: IAddressInfo): Observable<EntityResponseType> {
    return this.http.patch<IAddressInfo>(`${this.resourceUrl}/${getAddressInfoIdentifier(addressInfo) as number}`, addressInfo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAddressInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAddressInfo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAddressInfoToCollectionIfMissing(
    addressInfoCollection: IAddressInfo[],
    ...addressInfosToCheck: (IAddressInfo | null | undefined)[]
  ): IAddressInfo[] {
    const addressInfos: IAddressInfo[] = addressInfosToCheck.filter(isPresent);
    if (addressInfos.length > 0) {
      const addressInfoCollectionIdentifiers = addressInfoCollection.map(addressInfoItem => getAddressInfoIdentifier(addressInfoItem)!);
      const addressInfosToAdd = addressInfos.filter(addressInfoItem => {
        const addressInfoIdentifier = getAddressInfoIdentifier(addressInfoItem);
        if (addressInfoIdentifier == null || addressInfoCollectionIdentifiers.includes(addressInfoIdentifier)) {
          return false;
        }
        addressInfoCollectionIdentifiers.push(addressInfoIdentifier);
        return true;
      });
      return [...addressInfosToAdd, ...addressInfoCollection];
    }
    return addressInfoCollection;
  }
}
