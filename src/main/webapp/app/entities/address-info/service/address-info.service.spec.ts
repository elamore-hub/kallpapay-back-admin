import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAddressInfo, AddressInfo } from '../address-info.model';

import { AddressInfoService } from './address-info.service';

describe('AddressInfo Service', () => {
  let service: AddressInfoService;
  let httpMock: HttpTestingController;
  let elemDefault: IAddressInfo;
  let expectedResult: IAddressInfo | IAddressInfo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AddressInfoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should create a AddressInfo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AddressInfo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AddressInfo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should partial update a AddressInfo', () => {
      const patchObject = Object.assign({}, new AddressInfo());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AddressInfo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a AddressInfo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAddressInfoToCollectionIfMissing', () => {
      it('should add a AddressInfo to an empty array', () => {
        const addressInfo: IAddressInfo = { id: 123 };
        expectedResult = service.addAddressInfoToCollectionIfMissing([], addressInfo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(addressInfo);
      });

      it('should not add a AddressInfo to an array that contains it', () => {
        const addressInfo: IAddressInfo = { id: 123 };
        const addressInfoCollection: IAddressInfo[] = [
          {
            ...addressInfo,
          },
          { id: 456 },
        ];
        expectedResult = service.addAddressInfoToCollectionIfMissing(addressInfoCollection, addressInfo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AddressInfo to an array that doesn't contain it", () => {
        const addressInfo: IAddressInfo = { id: 123 };
        const addressInfoCollection: IAddressInfo[] = [{ id: 456 }];
        expectedResult = service.addAddressInfoToCollectionIfMissing(addressInfoCollection, addressInfo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(addressInfo);
      });

      it('should add only unique AddressInfo to an array', () => {
        const addressInfoArray: IAddressInfo[] = [{ id: 123 }, { id: 456 }, { id: 83456 }];
        const addressInfoCollection: IAddressInfo[] = [{ id: 123 }];
        expectedResult = service.addAddressInfoToCollectionIfMissing(addressInfoCollection, ...addressInfoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const addressInfo: IAddressInfo = { id: 123 };
        const addressInfo2: IAddressInfo = { id: 456 };
        expectedResult = service.addAddressInfoToCollectionIfMissing([], addressInfo, addressInfo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(addressInfo);
        expect(expectedResult).toContain(addressInfo2);
      });

      it('should accept null and undefined values', () => {
        const addressInfo: IAddressInfo = { id: 123 };
        expectedResult = service.addAddressInfoToCollectionIfMissing([], null, addressInfo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(addressInfo);
      });

      it('should return initial array if no AddressInfo is added', () => {
        const addressInfoCollection: IAddressInfo[] = [{ id: 123 }];
        expectedResult = service.addAddressInfoToCollectionIfMissing(addressInfoCollection, undefined, null);
        expect(expectedResult).toEqual(addressInfoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
