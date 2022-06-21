import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICause, Cause } from '../cause.model';

import { CauseService } from './cause.service';

describe('Cause Service', () => {
  let service: CauseService;
  let httpMock: HttpTestingController;
  let elemDefault: ICause;
  let expectedResult: ICause | ICause[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CauseService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      logoContentType: 'image/png',
      logo: 'AAAAAAA',
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

    it('should create a Cause', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Cause()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cause', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          logo: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cause', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
          logo: 'BBBBBB',
        },
        new Cause()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cause', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          logo: 'BBBBBB',
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

    it('should delete a Cause', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCauseToCollectionIfMissing', () => {
      it('should add a Cause to an empty array', () => {
        const cause: ICause = { id: 123 };
        expectedResult = service.addCauseToCollectionIfMissing([], cause);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cause);
      });

      it('should not add a Cause to an array that contains it', () => {
        const cause: ICause = { id: 123 };
        const causeCollection: ICause[] = [
          {
            ...cause,
          },
          { id: 456 },
        ];
        expectedResult = service.addCauseToCollectionIfMissing(causeCollection, cause);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cause to an array that doesn't contain it", () => {
        const cause: ICause = { id: 123 };
        const causeCollection: ICause[] = [{ id: 456 }];
        expectedResult = service.addCauseToCollectionIfMissing(causeCollection, cause);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cause);
      });

      it('should add only unique Cause to an array', () => {
        const causeArray: ICause[] = [{ id: 123 }, { id: 456 }, { id: 40892 }];
        const causeCollection: ICause[] = [{ id: 123 }];
        expectedResult = service.addCauseToCollectionIfMissing(causeCollection, ...causeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cause: ICause = { id: 123 };
        const cause2: ICause = { id: 456 };
        expectedResult = service.addCauseToCollectionIfMissing([], cause, cause2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cause);
        expect(expectedResult).toContain(cause2);
      });

      it('should accept null and undefined values', () => {
        const cause: ICause = { id: 123 };
        expectedResult = service.addCauseToCollectionIfMissing([], null, cause, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cause);
      });

      it('should return initial array if no Cause is added', () => {
        const causeCollection: ICause[] = [{ id: 123 }];
        expectedResult = service.addCauseToCollectionIfMissing(causeCollection, undefined, null);
        expect(expectedResult).toEqual(causeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
