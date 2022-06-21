import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAccountHolderInfo, AccountHolderInfo } from '../account-holder-info.model';

import { AccountHolderInfoService } from './account-holder-info.service';

describe('AccountHolderInfo Service', () => {
  let service: AccountHolderInfoService;
  let httpMock: HttpTestingController;
  let elemDefault: IAccountHolderInfo;
  let expectedResult: IAccountHolderInfo | IAccountHolderInfo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AccountHolderInfoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      type: 'AAAAAAA',
      name: 'AAAAAAA',
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

    it('should create a AccountHolderInfo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AccountHolderInfo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AccountHolderInfo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AccountHolderInfo', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new AccountHolderInfo()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AccountHolderInfo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          name: 'BBBBBB',
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

    it('should delete a AccountHolderInfo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAccountHolderInfoToCollectionIfMissing', () => {
      it('should add a AccountHolderInfo to an empty array', () => {
        const accountHolderInfo: IAccountHolderInfo = { id: 123 };
        expectedResult = service.addAccountHolderInfoToCollectionIfMissing([], accountHolderInfo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountHolderInfo);
      });

      it('should not add a AccountHolderInfo to an array that contains it', () => {
        const accountHolderInfo: IAccountHolderInfo = { id: 123 };
        const accountHolderInfoCollection: IAccountHolderInfo[] = [
          {
            ...accountHolderInfo,
          },
          { id: 456 },
        ];
        expectedResult = service.addAccountHolderInfoToCollectionIfMissing(accountHolderInfoCollection, accountHolderInfo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AccountHolderInfo to an array that doesn't contain it", () => {
        const accountHolderInfo: IAccountHolderInfo = { id: 123 };
        const accountHolderInfoCollection: IAccountHolderInfo[] = [{ id: 456 }];
        expectedResult = service.addAccountHolderInfoToCollectionIfMissing(accountHolderInfoCollection, accountHolderInfo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountHolderInfo);
      });

      it('should add only unique AccountHolderInfo to an array', () => {
        const accountHolderInfoArray: IAccountHolderInfo[] = [{ id: 123 }, { id: 456 }, { id: 49546 }];
        const accountHolderInfoCollection: IAccountHolderInfo[] = [{ id: 123 }];
        expectedResult = service.addAccountHolderInfoToCollectionIfMissing(accountHolderInfoCollection, ...accountHolderInfoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const accountHolderInfo: IAccountHolderInfo = { id: 123 };
        const accountHolderInfo2: IAccountHolderInfo = { id: 456 };
        expectedResult = service.addAccountHolderInfoToCollectionIfMissing([], accountHolderInfo, accountHolderInfo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountHolderInfo);
        expect(expectedResult).toContain(accountHolderInfo2);
      });

      it('should accept null and undefined values', () => {
        const accountHolderInfo: IAccountHolderInfo = { id: 123 };
        expectedResult = service.addAccountHolderInfoToCollectionIfMissing([], null, accountHolderInfo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountHolderInfo);
      });

      it('should return initial array if no AccountHolderInfo is added', () => {
        const accountHolderInfoCollection: IAccountHolderInfo[] = [{ id: 123 }];
        expectedResult = service.addAccountHolderInfoToCollectionIfMissing(accountHolderInfoCollection, undefined, null);
        expect(expectedResult).toEqual(accountHolderInfoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
