import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISupportingDocument, getSupportingDocumentIdentifier } from '../supporting-document.model';

export type EntityResponseType = HttpResponse<ISupportingDocument>;
export type EntityArrayResponseType = HttpResponse<ISupportingDocument[]>;

@Injectable({ providedIn: 'root' })
export class SupportingDocumentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/supporting-documents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(supportingDocument: ISupportingDocument): Observable<EntityResponseType> {
    return this.http.post<ISupportingDocument>(this.resourceUrl, supportingDocument, { observe: 'response' });
  }

  update(supportingDocument: ISupportingDocument): Observable<EntityResponseType> {
    return this.http.put<ISupportingDocument>(
      `${this.resourceUrl}/${getSupportingDocumentIdentifier(supportingDocument) as number}`,
      supportingDocument,
      { observe: 'response' }
    );
  }

  partialUpdate(supportingDocument: ISupportingDocument): Observable<EntityResponseType> {
    return this.http.patch<ISupportingDocument>(
      `${this.resourceUrl}/${getSupportingDocumentIdentifier(supportingDocument) as number}`,
      supportingDocument,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISupportingDocument>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISupportingDocument[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSupportingDocumentToCollectionIfMissing(
    supportingDocumentCollection: ISupportingDocument[],
    ...supportingDocumentsToCheck: (ISupportingDocument | null | undefined)[]
  ): ISupportingDocument[] {
    const supportingDocuments: ISupportingDocument[] = supportingDocumentsToCheck.filter(isPresent);
    if (supportingDocuments.length > 0) {
      const supportingDocumentCollectionIdentifiers = supportingDocumentCollection.map(
        supportingDocumentItem => getSupportingDocumentIdentifier(supportingDocumentItem)!
      );
      const supportingDocumentsToAdd = supportingDocuments.filter(supportingDocumentItem => {
        const supportingDocumentIdentifier = getSupportingDocumentIdentifier(supportingDocumentItem);
        if (supportingDocumentIdentifier == null || supportingDocumentCollectionIdentifiers.includes(supportingDocumentIdentifier)) {
          return false;
        }
        supportingDocumentCollectionIdentifiers.push(supportingDocumentIdentifier);
        return true;
      });
      return [...supportingDocumentsToAdd, ...supportingDocumentCollection];
    }
    return supportingDocumentCollection;
  }
}
