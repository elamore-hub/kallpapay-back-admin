import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStandingOrder, getStandingOrderIdentifier } from '../standing-order.model';

export type EntityResponseType = HttpResponse<IStandingOrder>;
export type EntityArrayResponseType = HttpResponse<IStandingOrder[]>;

@Injectable({ providedIn: 'root' })
export class StandingOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/standing-orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(standingOrder: IStandingOrder): Observable<EntityResponseType> {
    return this.http.post<IStandingOrder>(this.resourceUrl, standingOrder, { observe: 'response' });
  }

  update(standingOrder: IStandingOrder): Observable<EntityResponseType> {
    return this.http.put<IStandingOrder>(`${this.resourceUrl}/${getStandingOrderIdentifier(standingOrder) as number}`, standingOrder, {
      observe: 'response',
    });
  }

  partialUpdate(standingOrder: IStandingOrder): Observable<EntityResponseType> {
    return this.http.patch<IStandingOrder>(`${this.resourceUrl}/${getStandingOrderIdentifier(standingOrder) as number}`, standingOrder, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStandingOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStandingOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStandingOrderToCollectionIfMissing(
    standingOrderCollection: IStandingOrder[],
    ...standingOrdersToCheck: (IStandingOrder | null | undefined)[]
  ): IStandingOrder[] {
    const standingOrders: IStandingOrder[] = standingOrdersToCheck.filter(isPresent);
    if (standingOrders.length > 0) {
      const standingOrderCollectionIdentifiers = standingOrderCollection.map(
        standingOrderItem => getStandingOrderIdentifier(standingOrderItem)!
      );
      const standingOrdersToAdd = standingOrders.filter(standingOrderItem => {
        const standingOrderIdentifier = getStandingOrderIdentifier(standingOrderItem);
        if (standingOrderIdentifier == null || standingOrderCollectionIdentifiers.includes(standingOrderIdentifier)) {
          return false;
        }
        standingOrderCollectionIdentifiers.push(standingOrderIdentifier);
        return true;
      });
      return [...standingOrdersToAdd, ...standingOrderCollection];
    }
    return standingOrderCollection;
  }
}
