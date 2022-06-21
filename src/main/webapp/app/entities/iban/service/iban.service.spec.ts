import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIBAN, IBAN } from '../iban.model';

import { IBANService } from './iban.service';

describe('IBAN Service', () => {
  let service: IBANService;
  let httpMock: HttpTestingController;
  let elemDefault: IIBAN;
  let expectedResult: IIBAN | IIBAN[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IBANService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      iban: 'AAAAAAA',
      bic: 'AAAAAAA',
      accountOwner: 'AAAAAAA',
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

    it('should create a IBAN', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new IBAN()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a IBAN', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          iban: 'BBBBBB',
          bic: 'BBBBBB',
          accountOwner: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a IBAN', () => {
      const patchObject = Object.assign(
        {
          iban: 'BBBBBB',
          bic: 'BBBBBB',
        },
        new IBAN()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of IBAN', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          iban: 'BBBBBB',
          bic: 'BBBBBB',
          accountOwner: 'BBBBBB',
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

    it('should delete a IBAN', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addIBANToCollectionIfMissing', () => {
      it('should add a IBAN to an empty array', () => {
        const iBAN: IIBAN = { id: 123 };
        expectedResult = service.addIBANToCollectionIfMissing([], iBAN);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(iBAN);
      });

      it('should not add a IBAN to an array that contains it', () => {
        const iBAN: IIBAN = { id: 123 };
        const iBANCollection: IIBAN[] = [
          {
            ...iBAN,
          },
          { id: 456 },
        ];
        expectedResult = service.addIBANToCollectionIfMissing(iBANCollection, iBAN);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a IBAN to an array that doesn't contain it", () => {
        const iBAN: IIBAN = { id: 123 };
        const iBANCollection: IIBAN[] = [{ id: 456 }];
        expectedResult = service.addIBANToCollectionIfMissing(iBANCollection, iBAN);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(iBAN);
      });

      it('should add only unique IBAN to an array', () => {
        const iBANArray: IIBAN[] = [{ id: 123 }, { id: 456 }, { id: 64522 }];
        const iBANCollection: IIBAN[] = [{ id: 123 }];
        expectedResult = service.addIBANToCollectionIfMissing(iBANCollection, ...iBANArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const iBAN: IIBAN = { id: 123 };
        const iBAN2: IIBAN = { id: 456 };
        expectedResult = service.addIBANToCollectionIfMissing([], iBAN, iBAN2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(iBAN);
        expect(expectedResult).toContain(iBAN2);
      });

      it('should accept null and undefined values', () => {
        const iBAN: IIBAN = { id: 123 };
        expectedResult = service.addIBANToCollectionIfMissing([], null, iBAN, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(iBAN);
      });

      it('should return initial array if no IBAN is added', () => {
        const iBANCollection: IIBAN[] = [{ id: 123 }];
        expectedResult = service.addIBANToCollectionIfMissing(iBANCollection, undefined, null);
        expect(expectedResult).toEqual(iBANCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
