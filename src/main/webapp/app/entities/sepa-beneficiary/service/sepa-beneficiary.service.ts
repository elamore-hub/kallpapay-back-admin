import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISEPABeneficiary, getSEPABeneficiaryIdentifier } from '../sepa-beneficiary.model';

export type EntityResponseType = HttpResponse<ISEPABeneficiary>;
export type EntityArrayResponseType = HttpResponse<ISEPABeneficiary[]>;

@Injectable({ providedIn: 'root' })
export class SEPABeneficiaryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sepa-beneficiaries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sEPABeneficiary: ISEPABeneficiary): Observable<EntityResponseType> {
    return this.http.post<ISEPABeneficiary>(this.resourceUrl, sEPABeneficiary, { observe: 'response' });
  }

  update(sEPABeneficiary: ISEPABeneficiary): Observable<EntityResponseType> {
    return this.http.put<ISEPABeneficiary>(
      `${this.resourceUrl}/${getSEPABeneficiaryIdentifier(sEPABeneficiary) as number}`,
      sEPABeneficiary,
      { observe: 'response' }
    );
  }

  partialUpdate(sEPABeneficiary: ISEPABeneficiary): Observable<EntityResponseType> {
    return this.http.patch<ISEPABeneficiary>(
      `${this.resourceUrl}/${getSEPABeneficiaryIdentifier(sEPABeneficiary) as number}`,
      sEPABeneficiary,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISEPABeneficiary>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISEPABeneficiary[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSEPABeneficiaryToCollectionIfMissing(
    sEPABeneficiaryCollection: ISEPABeneficiary[],
    ...sEPABeneficiariesToCheck: (ISEPABeneficiary | null | undefined)[]
  ): ISEPABeneficiary[] {
    const sEPABeneficiaries: ISEPABeneficiary[] = sEPABeneficiariesToCheck.filter(isPresent);
    if (sEPABeneficiaries.length > 0) {
      const sEPABeneficiaryCollectionIdentifiers = sEPABeneficiaryCollection.map(
        sEPABeneficiaryItem => getSEPABeneficiaryIdentifier(sEPABeneficiaryItem)!
      );
      const sEPABeneficiariesToAdd = sEPABeneficiaries.filter(sEPABeneficiaryItem => {
        const sEPABeneficiaryIdentifier = getSEPABeneficiaryIdentifier(sEPABeneficiaryItem);
        if (sEPABeneficiaryIdentifier == null || sEPABeneficiaryCollectionIdentifiers.includes(sEPABeneficiaryIdentifier)) {
          return false;
        }
        sEPABeneficiaryCollectionIdentifiers.push(sEPABeneficiaryIdentifier);
        return true;
      });
      return [...sEPABeneficiariesToAdd, ...sEPABeneficiaryCollection];
    }
    return sEPABeneficiaryCollection;
  }
}
