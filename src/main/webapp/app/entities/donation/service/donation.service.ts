import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDonation, getDonationIdentifier } from '../donation.model';

export type EntityResponseType = HttpResponse<IDonation>;
export type EntityArrayResponseType = HttpResponse<IDonation[]>;

@Injectable({ providedIn: 'root' })
export class DonationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/donations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(donation: IDonation): Observable<EntityResponseType> {
    return this.http.post<IDonation>(this.resourceUrl, donation, { observe: 'response' });
  }

  update(donation: IDonation): Observable<EntityResponseType> {
    return this.http.put<IDonation>(`${this.resourceUrl}/${getDonationIdentifier(donation) as number}`, donation, { observe: 'response' });
  }

  partialUpdate(donation: IDonation): Observable<EntityResponseType> {
    return this.http.patch<IDonation>(`${this.resourceUrl}/${getDonationIdentifier(donation) as number}`, donation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDonation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDonation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDonationToCollectionIfMissing(donationCollection: IDonation[], ...donationsToCheck: (IDonation | null | undefined)[]): IDonation[] {
    const donations: IDonation[] = donationsToCheck.filter(isPresent);
    if (donations.length > 0) {
      const donationCollectionIdentifiers = donationCollection.map(donationItem => getDonationIdentifier(donationItem)!);
      const donationsToAdd = donations.filter(donationItem => {
        const donationIdentifier = getDonationIdentifier(donationItem);
        if (donationIdentifier == null || donationCollectionIdentifiers.includes(donationIdentifier)) {
          return false;
        }
        donationCollectionIdentifiers.push(donationIdentifier);
        return true;
      });
      return [...donationsToAdd, ...donationCollection];
    }
    return donationCollection;
  }
}
