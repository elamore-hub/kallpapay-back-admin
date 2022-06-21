import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPortfolio, getPortfolioIdentifier } from '../portfolio.model';

export type EntityResponseType = HttpResponse<IPortfolio>;
export type EntityArrayResponseType = HttpResponse<IPortfolio[]>;

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/portfolios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(portfolio: IPortfolio): Observable<EntityResponseType> {
    return this.http.post<IPortfolio>(this.resourceUrl, portfolio, { observe: 'response' });
  }

  update(portfolio: IPortfolio): Observable<EntityResponseType> {
    return this.http.put<IPortfolio>(`${this.resourceUrl}/${getPortfolioIdentifier(portfolio) as number}`, portfolio, {
      observe: 'response',
    });
  }

  partialUpdate(portfolio: IPortfolio): Observable<EntityResponseType> {
    return this.http.patch<IPortfolio>(`${this.resourceUrl}/${getPortfolioIdentifier(portfolio) as number}`, portfolio, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPortfolio>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPortfolio[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPortfolioToCollectionIfMissing(
    portfolioCollection: IPortfolio[],
    ...portfoliosToCheck: (IPortfolio | null | undefined)[]
  ): IPortfolio[] {
    const portfolios: IPortfolio[] = portfoliosToCheck.filter(isPresent);
    if (portfolios.length > 0) {
      const portfolioCollectionIdentifiers = portfolioCollection.map(portfolioItem => getPortfolioIdentifier(portfolioItem)!);
      const portfoliosToAdd = portfolios.filter(portfolioItem => {
        const portfolioIdentifier = getPortfolioIdentifier(portfolioItem);
        if (portfolioIdentifier == null || portfolioCollectionIdentifiers.includes(portfolioIdentifier)) {
          return false;
        }
        portfolioCollectionIdentifiers.push(portfolioIdentifier);
        return true;
      });
      return [...portfoliosToAdd, ...portfolioCollection];
    }
    return portfolioCollection;
  }
}
