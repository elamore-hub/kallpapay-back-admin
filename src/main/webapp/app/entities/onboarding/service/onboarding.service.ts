import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOnboarding, getOnboardingIdentifier } from '../onboarding.model';

export type EntityResponseType = HttpResponse<IOnboarding>;
export type EntityArrayResponseType = HttpResponse<IOnboarding[]>;

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/onboardings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(onboarding: IOnboarding): Observable<EntityResponseType> {
    return this.http.post<IOnboarding>(this.resourceUrl, onboarding, { observe: 'response' });
  }

  update(onboarding: IOnboarding): Observable<EntityResponseType> {
    return this.http.put<IOnboarding>(`${this.resourceUrl}/${getOnboardingIdentifier(onboarding) as number}`, onboarding, {
      observe: 'response',
    });
  }

  partialUpdate(onboarding: IOnboarding): Observable<EntityResponseType> {
    return this.http.patch<IOnboarding>(`${this.resourceUrl}/${getOnboardingIdentifier(onboarding) as number}`, onboarding, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOnboarding>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOnboarding[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOnboardingToCollectionIfMissing(
    onboardingCollection: IOnboarding[],
    ...onboardingsToCheck: (IOnboarding | null | undefined)[]
  ): IOnboarding[] {
    const onboardings: IOnboarding[] = onboardingsToCheck.filter(isPresent);
    if (onboardings.length > 0) {
      const onboardingCollectionIdentifiers = onboardingCollection.map(onboardingItem => getOnboardingIdentifier(onboardingItem)!);
      const onboardingsToAdd = onboardings.filter(onboardingItem => {
        const onboardingIdentifier = getOnboardingIdentifier(onboardingItem);
        if (onboardingIdentifier == null || onboardingCollectionIdentifiers.includes(onboardingIdentifier)) {
          return false;
        }
        onboardingCollectionIdentifiers.push(onboardingIdentifier);
        return true;
      });
      return [...onboardingsToAdd, ...onboardingCollection];
    }
    return onboardingCollection;
  }
}
