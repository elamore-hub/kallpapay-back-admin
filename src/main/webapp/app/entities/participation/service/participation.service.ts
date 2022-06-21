import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParticipation, getParticipationIdentifier } from '../participation.model';

export type EntityResponseType = HttpResponse<IParticipation>;
export type EntityArrayResponseType = HttpResponse<IParticipation[]>;

@Injectable({ providedIn: 'root' })
export class ParticipationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/participations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(participation: IParticipation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(participation);
    return this.http
      .post<IParticipation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(participation: IParticipation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(participation);
    return this.http
      .put<IParticipation>(`${this.resourceUrl}/${getParticipationIdentifier(participation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(participation: IParticipation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(participation);
    return this.http
      .patch<IParticipation>(`${this.resourceUrl}/${getParticipationIdentifier(participation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IParticipation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IParticipation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParticipationToCollectionIfMissing(
    participationCollection: IParticipation[],
    ...participationsToCheck: (IParticipation | null | undefined)[]
  ): IParticipation[] {
    const participations: IParticipation[] = participationsToCheck.filter(isPresent);
    if (participations.length > 0) {
      const participationCollectionIdentifiers = participationCollection.map(
        participationItem => getParticipationIdentifier(participationItem)!
      );
      const participationsToAdd = participations.filter(participationItem => {
        const participationIdentifier = getParticipationIdentifier(participationItem);
        if (participationIdentifier == null || participationCollectionIdentifiers.includes(participationIdentifier)) {
          return false;
        }
        participationCollectionIdentifiers.push(participationIdentifier);
        return true;
      });
      return [...participationsToAdd, ...participationCollection];
    }
    return participationCollection;
  }

  protected convertDateFromClient(participation: IParticipation): IParticipation {
    return Object.assign({}, participation, {
      creationDate: participation.creationDate?.isValid() ? participation.creationDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creationDate = res.body.creationDate ? dayjs(res.body.creationDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((participation: IParticipation) => {
        participation.creationDate = participation.creationDate ? dayjs(participation.creationDate) : undefined;
      });
    }
    return res;
  }
}
