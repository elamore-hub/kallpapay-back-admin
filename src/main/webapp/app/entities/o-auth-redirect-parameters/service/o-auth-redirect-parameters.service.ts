import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOAuthRedirectParameters, getOAuthRedirectParametersIdentifier } from '../o-auth-redirect-parameters.model';

export type EntityResponseType = HttpResponse<IOAuthRedirectParameters>;
export type EntityArrayResponseType = HttpResponse<IOAuthRedirectParameters[]>;

@Injectable({ providedIn: 'root' })
export class OAuthRedirectParametersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/o-auth-redirect-parameters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(oAuthRedirectParameters: IOAuthRedirectParameters): Observable<EntityResponseType> {
    return this.http.post<IOAuthRedirectParameters>(this.resourceUrl, oAuthRedirectParameters, { observe: 'response' });
  }

  update(oAuthRedirectParameters: IOAuthRedirectParameters): Observable<EntityResponseType> {
    return this.http.put<IOAuthRedirectParameters>(
      `${this.resourceUrl}/${getOAuthRedirectParametersIdentifier(oAuthRedirectParameters) as number}`,
      oAuthRedirectParameters,
      { observe: 'response' }
    );
  }

  partialUpdate(oAuthRedirectParameters: IOAuthRedirectParameters): Observable<EntityResponseType> {
    return this.http.patch<IOAuthRedirectParameters>(
      `${this.resourceUrl}/${getOAuthRedirectParametersIdentifier(oAuthRedirectParameters) as number}`,
      oAuthRedirectParameters,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOAuthRedirectParameters>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOAuthRedirectParameters[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOAuthRedirectParametersToCollectionIfMissing(
    oAuthRedirectParametersCollection: IOAuthRedirectParameters[],
    ...oAuthRedirectParametersToCheck: (IOAuthRedirectParameters | null | undefined)[]
  ): IOAuthRedirectParameters[] {
    const oAuthRedirectParameters: IOAuthRedirectParameters[] = oAuthRedirectParametersToCheck.filter(isPresent);
    if (oAuthRedirectParameters.length > 0) {
      const oAuthRedirectParametersCollectionIdentifiers = oAuthRedirectParametersCollection.map(
        oAuthRedirectParametersItem => getOAuthRedirectParametersIdentifier(oAuthRedirectParametersItem)!
      );
      const oAuthRedirectParametersToAdd = oAuthRedirectParameters.filter(oAuthRedirectParametersItem => {
        const oAuthRedirectParametersIdentifier = getOAuthRedirectParametersIdentifier(oAuthRedirectParametersItem);
        if (
          oAuthRedirectParametersIdentifier == null ||
          oAuthRedirectParametersCollectionIdentifiers.includes(oAuthRedirectParametersIdentifier)
        ) {
          return false;
        }
        oAuthRedirectParametersCollectionIdentifiers.push(oAuthRedirectParametersIdentifier);
        return true;
      });
      return [...oAuthRedirectParametersToAdd, ...oAuthRedirectParametersCollection];
    }
    return oAuthRedirectParametersCollection;
  }
}
