import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAccountHolder, AccountHolder } from '../account-holder.model';

import { AccountHolderService } from './account-holder.service';

describe('AccountHolder Service', () => {
  let service: AccountHolderService;
  let httpMock: HttpTestingController;
  let elemDefault: IAccountHolder;
  let expectedResult: IAccountHolder | IAccountHolder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AccountHolderService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      externalId: 'AAAAAAA',
      verificationStatus: 'AAAAAAA',
      statusInfo: 'AAAAAAA',
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

    it('should create a AccountHolder', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AccountHolder()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AccountHolder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          verificationStatus: 'BBBBBB',
          statusInfo: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AccountHolder', () => {
      const patchObject = Object.assign(
        {
          externalId: 'BBBBBB',
          verificationStatus: 'BBBBBB',
        },
        new AccountHolder()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AccountHolder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          verificationStatus: 'BBBBBB',
          statusInfo: 'BBBBBB',
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

    it('should delete a AccountHolder', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAccountHolderToCollectionIfMissing', () => {
      it('should add a AccountHolder to an empty array', () => {
        const accountHolder: IAccountHolder = { id: 123 };
        expectedResult = service.addAccountHolderToCollectionIfMissing([], accountHolder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountHolder);
      });

      it('should not add a AccountHolder to an array that contains it', () => {
        const accountHolder: IAccountHolder = { id: 123 };
        const accountHolderCollection: IAccountHolder[] = [
          {
            ...accountHolder,
          },
          { id: 456 },
        ];
        expectedResult = service.addAccountHolderToCollectionIfMissing(accountHolderCollection, accountHolder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AccountHolder to an array that doesn't contain it", () => {
        const accountHolder: IAccountHolder = { id: 123 };
        const accountHolderCollection: IAccountHolder[] = [{ id: 456 }];
        expectedResult = service.addAccountHolderToCollectionIfMissing(accountHolderCollection, accountHolder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountHolder);
      });

      it('should add only unique AccountHolder to an array', () => {
        const accountHolderArray: IAccountHolder[] = [{ id: 123 }, { id: 456 }, { id: 72871 }];
        const accountHolderCollection: IAccountHolder[] = [{ id: 123 }];
        expectedResult = service.addAccountHolderToCollectionIfMissing(accountHolderCollection, ...accountHolderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const accountHolder: IAccountHolder = { id: 123 };
        const accountHolder2: IAccountHolder = { id: 456 };
        expectedResult = service.addAccountHolderToCollectionIfMissing([], accountHolder, accountHolder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountHolder);
        expect(expectedResult).toContain(accountHolder2);
      });

      it('should accept null and undefined values', () => {
        const accountHolder: IAccountHolder = { id: 123 };
        expectedResult = service.addAccountHolderToCollectionIfMissing([], null, accountHolder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountHolder);
      });

      it('should return initial array if no AccountHolder is added', () => {
        const accountHolderCollection: IAccountHolder[] = [{ id: 123 }];
        expectedResult = service.addAccountHolderToCollectionIfMissing(accountHolderCollection, undefined, null);
        expect(expectedResult).toEqual(accountHolderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
