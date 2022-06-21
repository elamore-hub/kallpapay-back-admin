import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAmount, Amount } from '../amount.model';

import { AmountService } from './amount.service';

describe('Amount Service', () => {
  let service: AmountService;
  let httpMock: HttpTestingController;
  let elemDefault: IAmount;
  let expectedResult: IAmount | IAmount[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AmountService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      currency: 'AAAAAAA',
      value: 0,
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

    it('should create a Amount', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Amount()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Amount', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          currency: 'BBBBBB',
          value: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Amount', () => {
      const patchObject = Object.assign(
        {
          value: 1,
        },
        new Amount()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Amount', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          currency: 'BBBBBB',
          value: 1,
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

    it('should delete a Amount', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAmountToCollectionIfMissing', () => {
      it('should add a Amount to an empty array', () => {
        const amount: IAmount = { id: 123 };
        expectedResult = service.addAmountToCollectionIfMissing([], amount);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(amount);
      });

      it('should not add a Amount to an array that contains it', () => {
        const amount: IAmount = { id: 123 };
        const amountCollection: IAmount[] = [
          {
            ...amount,
          },
          { id: 456 },
        ];
        expectedResult = service.addAmountToCollectionIfMissing(amountCollection, amount);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Amount to an array that doesn't contain it", () => {
        const amount: IAmount = { id: 123 };
        const amountCollection: IAmount[] = [{ id: 456 }];
        expectedResult = service.addAmountToCollectionIfMissing(amountCollection, amount);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(amount);
      });

      it('should add only unique Amount to an array', () => {
        const amountArray: IAmount[] = [{ id: 123 }, { id: 456 }, { id: 79352 }];
        const amountCollection: IAmount[] = [{ id: 123 }];
        expectedResult = service.addAmountToCollectionIfMissing(amountCollection, ...amountArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const amount: IAmount = { id: 123 };
        const amount2: IAmount = { id: 456 };
        expectedResult = service.addAmountToCollectionIfMissing([], amount, amount2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(amount);
        expect(expectedResult).toContain(amount2);
      });

      it('should accept null and undefined values', () => {
        const amount: IAmount = { id: 123 };
        expectedResult = service.addAmountToCollectionIfMissing([], null, amount, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(amount);
      });

      it('should return initial array if no Amount is added', () => {
        const amountCollection: IAmount[] = [{ id: 123 }];
        expectedResult = service.addAmountToCollectionIfMissing(amountCollection, undefined, null);
        expect(expectedResult).toEqual(amountCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
