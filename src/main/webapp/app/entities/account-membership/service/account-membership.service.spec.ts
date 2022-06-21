import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAccountMembership, AccountMembership } from '../account-membership.model';

import { AccountMembershipService } from './account-membership.service';

describe('AccountMembership Service', () => {
  let service: AccountMembershipService;
  let httpMock: HttpTestingController;
  let elemDefault: IAccountMembership;
  let expectedResult: IAccountMembership | IAccountMembership[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AccountMembershipService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      externalId: 'AAAAAAA',
      email: 'AAAAAAA',
      status: 'AAAAAAA',
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

    it('should create a AccountMembership', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AccountMembership()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AccountMembership', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          email: 'BBBBBB',
          status: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AccountMembership', () => {
      const patchObject = Object.assign({}, new AccountMembership());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AccountMembership', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          email: 'BBBBBB',
          status: 'BBBBBB',
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

    it('should delete a AccountMembership', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAccountMembershipToCollectionIfMissing', () => {
      it('should add a AccountMembership to an empty array', () => {
        const accountMembership: IAccountMembership = { id: 123 };
        expectedResult = service.addAccountMembershipToCollectionIfMissing([], accountMembership);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountMembership);
      });

      it('should not add a AccountMembership to an array that contains it', () => {
        const accountMembership: IAccountMembership = { id: 123 };
        const accountMembershipCollection: IAccountMembership[] = [
          {
            ...accountMembership,
          },
          { id: 456 },
        ];
        expectedResult = service.addAccountMembershipToCollectionIfMissing(accountMembershipCollection, accountMembership);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AccountMembership to an array that doesn't contain it", () => {
        const accountMembership: IAccountMembership = { id: 123 };
        const accountMembershipCollection: IAccountMembership[] = [{ id: 456 }];
        expectedResult = service.addAccountMembershipToCollectionIfMissing(accountMembershipCollection, accountMembership);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountMembership);
      });

      it('should add only unique AccountMembership to an array', () => {
        const accountMembershipArray: IAccountMembership[] = [{ id: 123 }, { id: 456 }, { id: 46791 }];
        const accountMembershipCollection: IAccountMembership[] = [{ id: 123 }];
        expectedResult = service.addAccountMembershipToCollectionIfMissing(accountMembershipCollection, ...accountMembershipArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const accountMembership: IAccountMembership = { id: 123 };
        const accountMembership2: IAccountMembership = { id: 456 };
        expectedResult = service.addAccountMembershipToCollectionIfMissing([], accountMembership, accountMembership2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountMembership);
        expect(expectedResult).toContain(accountMembership2);
      });

      it('should accept null and undefined values', () => {
        const accountMembership: IAccountMembership = { id: 123 };
        expectedResult = service.addAccountMembershipToCollectionIfMissing([], null, accountMembership, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountMembership);
      });

      it('should return initial array if no AccountMembership is added', () => {
        const accountMembershipCollection: IAccountMembership[] = [{ id: 123 }];
        expectedResult = service.addAccountMembershipToCollectionIfMissing(accountMembershipCollection, undefined, null);
        expect(expectedResult).toEqual(accountMembershipCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
