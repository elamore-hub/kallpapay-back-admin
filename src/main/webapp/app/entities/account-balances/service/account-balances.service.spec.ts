import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAccountBalances, AccountBalances } from '../account-balances.model';

import { AccountBalancesService } from './account-balances.service';

describe('AccountBalances Service', () => {
  let service: AccountBalancesService;
  let httpMock: HttpTestingController;
  let elemDefault: IAccountBalances;
  let expectedResult: IAccountBalances | IAccountBalances[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AccountBalancesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should create a AccountBalances', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AccountBalances()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AccountBalances', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AccountBalances', () => {
      const patchObject = Object.assign({}, new AccountBalances());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AccountBalances', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a AccountBalances', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAccountBalancesToCollectionIfMissing', () => {
      it('should add a AccountBalances to an empty array', () => {
        const accountBalances: IAccountBalances = { id: 123 };
        expectedResult = service.addAccountBalancesToCollectionIfMissing([], accountBalances);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountBalances);
      });

      it('should not add a AccountBalances to an array that contains it', () => {
        const accountBalances: IAccountBalances = { id: 123 };
        const accountBalancesCollection: IAccountBalances[] = [
          {
            ...accountBalances,
          },
          { id: 456 },
        ];
        expectedResult = service.addAccountBalancesToCollectionIfMissing(accountBalancesCollection, accountBalances);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AccountBalances to an array that doesn't contain it", () => {
        const accountBalances: IAccountBalances = { id: 123 };
        const accountBalancesCollection: IAccountBalances[] = [{ id: 456 }];
        expectedResult = service.addAccountBalancesToCollectionIfMissing(accountBalancesCollection, accountBalances);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountBalances);
      });

      it('should add only unique AccountBalances to an array', () => {
        const accountBalancesArray: IAccountBalances[] = [{ id: 123 }, { id: 456 }, { id: 1390 }];
        const accountBalancesCollection: IAccountBalances[] = [{ id: 123 }];
        expectedResult = service.addAccountBalancesToCollectionIfMissing(accountBalancesCollection, ...accountBalancesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const accountBalances: IAccountBalances = { id: 123 };
        const accountBalances2: IAccountBalances = { id: 456 };
        expectedResult = service.addAccountBalancesToCollectionIfMissing([], accountBalances, accountBalances2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountBalances);
        expect(expectedResult).toContain(accountBalances2);
      });

      it('should accept null and undefined values', () => {
        const accountBalances: IAccountBalances = { id: 123 };
        expectedResult = service.addAccountBalancesToCollectionIfMissing([], null, accountBalances, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountBalances);
      });

      it('should return initial array if no AccountBalances is added', () => {
        const accountBalancesCollection: IAccountBalances[] = [{ id: 123 }];
        expectedResult = service.addAccountBalancesToCollectionIfMissing(accountBalancesCollection, undefined, null);
        expect(expectedResult).toEqual(accountBalancesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
