import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISupportingDocument, SupportingDocument } from '../supporting-document.model';

import { SupportingDocumentService } from './supporting-document.service';

describe('SupportingDocument Service', () => {
  let service: SupportingDocumentService;
  let httpMock: HttpTestingController;
  let elemDefault: ISupportingDocument;
  let expectedResult: ISupportingDocument | ISupportingDocument[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SupportingDocumentService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      externalId: 'AAAAAAA',
      status: 'AAAAAAA',
      supportingDocumentType: 'AAAAAAA',
      supportingDocumentPurpose: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a SupportingDocument', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SupportingDocument()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SupportingDocument', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          status: 'BBBBBB',
          supportingDocumentType: 'BBBBBB',
          supportingDocumentPurpose: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SupportingDocument', () => {
      const patchObject = Object.assign(
        {
          supportingDocumentPurpose: 'BBBBBB',
        },
        new SupportingDocument()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SupportingDocument', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          status: 'BBBBBB',
          supportingDocumentType: 'BBBBBB',
          supportingDocumentPurpose: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a SupportingDocument', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSupportingDocumentToCollectionIfMissing', () => {
      it('should add a SupportingDocument to an empty array', () => {
        const supportingDocument: ISupportingDocument = { id: 123 };
        expectedResult = service.addSupportingDocumentToCollectionIfMissing([], supportingDocument);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(supportingDocument);
      });

      it('should not add a SupportingDocument to an array that contains it', () => {
        const supportingDocument: ISupportingDocument = { id: 123 };
        const supportingDocumentCollection: ISupportingDocument[] = [
          {
            ...supportingDocument,
          },
          { id: 456 },
        ];
        expectedResult = service.addSupportingDocumentToCollectionIfMissing(supportingDocumentCollection, supportingDocument);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SupportingDocument to an array that doesn't contain it", () => {
        const supportingDocument: ISupportingDocument = { id: 123 };
        const supportingDocumentCollection: ISupportingDocument[] = [{ id: 456 }];
        expectedResult = service.addSupportingDocumentToCollectionIfMissing(supportingDocumentCollection, supportingDocument);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(supportingDocument);
      });

      it('should add only unique SupportingDocument to an array', () => {
        const supportingDocumentArray: ISupportingDocument[] = [{ id: 123 }, { id: 456 }, { id: 46123 }];
        const supportingDocumentCollection: ISupportingDocument[] = [{ id: 123 }];
        expectedResult = service.addSupportingDocumentToCollectionIfMissing(supportingDocumentCollection, ...supportingDocumentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const supportingDocument: ISupportingDocument = { id: 123 };
        const supportingDocument2: ISupportingDocument = { id: 456 };
        expectedResult = service.addSupportingDocumentToCollectionIfMissing([], supportingDocument, supportingDocument2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(supportingDocument);
        expect(expectedResult).toContain(supportingDocument2);
      });

      it('should accept null and undefined values', () => {
        const supportingDocument: ISupportingDocument = { id: 123 };
        expectedResult = service.addSupportingDocumentToCollectionIfMissing([], null, supportingDocument, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(supportingDocument);
      });

      it('should return initial array if no SupportingDocument is added', () => {
        const supportingDocumentCollection: ISupportingDocument[] = [{ id: 123 }];
        expectedResult = service.addSupportingDocumentToCollectionIfMissing(supportingDocumentCollection, undefined, null);
        expect(expectedResult).toEqual(supportingDocumentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
