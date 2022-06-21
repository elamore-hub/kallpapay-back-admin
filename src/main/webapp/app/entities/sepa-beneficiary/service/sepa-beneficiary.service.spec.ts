import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISEPABeneficiary, SEPABeneficiary } from '../sepa-beneficiary.model';

import { SEPABeneficiaryService } from './sepa-beneficiary.service';

describe('SEPABeneficiary Service', () => {
  let service: SEPABeneficiaryService;
  let httpMock: HttpTestingController;
  let elemDefault: ISEPABeneficiary;
  let expectedResult: ISEPABeneficiary | ISEPABeneficiary[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SEPABeneficiaryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      externalId: 'AAAAAAA',
      name: 'AAAAAAA',
      isMyOwnIban: false,
      maskedIBAN: 'AAAAAAA',
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

    it('should create a SEPABeneficiary', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SEPABeneficiary()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SEPABeneficiary', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          name: 'BBBBBB',
          isMyOwnIban: true,
          maskedIBAN: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SEPABeneficiary', () => {
      const patchObject = Object.assign(
        {
          externalId: 'BBBBBB',
          name: 'BBBBBB',
          isMyOwnIban: true,
          maskedIBAN: 'BBBBBB',
        },
        new SEPABeneficiary()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SEPABeneficiary', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          name: 'BBBBBB',
          isMyOwnIban: true,
          maskedIBAN: 'BBBBBB',
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

    it('should delete a SEPABeneficiary', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSEPABeneficiaryToCollectionIfMissing', () => {
      it('should add a SEPABeneficiary to an empty array', () => {
        const sEPABeneficiary: ISEPABeneficiary = { id: 123 };
        expectedResult = service.addSEPABeneficiaryToCollectionIfMissing([], sEPABeneficiary);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sEPABeneficiary);
      });

      it('should not add a SEPABeneficiary to an array that contains it', () => {
        const sEPABeneficiary: ISEPABeneficiary = { id: 123 };
        const sEPABeneficiaryCollection: ISEPABeneficiary[] = [
          {
            ...sEPABeneficiary,
          },
          { id: 456 },
        ];
        expectedResult = service.addSEPABeneficiaryToCollectionIfMissing(sEPABeneficiaryCollection, sEPABeneficiary);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SEPABeneficiary to an array that doesn't contain it", () => {
        const sEPABeneficiary: ISEPABeneficiary = { id: 123 };
        const sEPABeneficiaryCollection: ISEPABeneficiary[] = [{ id: 456 }];
        expectedResult = service.addSEPABeneficiaryToCollectionIfMissing(sEPABeneficiaryCollection, sEPABeneficiary);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sEPABeneficiary);
      });

      it('should add only unique SEPABeneficiary to an array', () => {
        const sEPABeneficiaryArray: ISEPABeneficiary[] = [{ id: 123 }, { id: 456 }, { id: 84855 }];
        const sEPABeneficiaryCollection: ISEPABeneficiary[] = [{ id: 123 }];
        expectedResult = service.addSEPABeneficiaryToCollectionIfMissing(sEPABeneficiaryCollection, ...sEPABeneficiaryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sEPABeneficiary: ISEPABeneficiary = { id: 123 };
        const sEPABeneficiary2: ISEPABeneficiary = { id: 456 };
        expectedResult = service.addSEPABeneficiaryToCollectionIfMissing([], sEPABeneficiary, sEPABeneficiary2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sEPABeneficiary);
        expect(expectedResult).toContain(sEPABeneficiary2);
      });

      it('should accept null and undefined values', () => {
        const sEPABeneficiary: ISEPABeneficiary = { id: 123 };
        expectedResult = service.addSEPABeneficiaryToCollectionIfMissing([], null, sEPABeneficiary, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sEPABeneficiary);
      });

      it('should return initial array if no SEPABeneficiary is added', () => {
        const sEPABeneficiaryCollection: ISEPABeneficiary[] = [{ id: 123 }];
        expectedResult = service.addSEPABeneficiaryToCollectionIfMissing(sEPABeneficiaryCollection, undefined, null);
        expect(expectedResult).toEqual(sEPABeneficiaryCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
