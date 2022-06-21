import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStandingOrder, StandingOrder } from '../standing-order.model';

import { StandingOrderService } from './standing-order.service';

describe('StandingOrder Service', () => {
  let service: StandingOrderService;
  let httpMock: HttpTestingController;
  let elemDefault: IStandingOrder;
  let expectedResult: IStandingOrder | IStandingOrder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StandingOrderService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      externalId: 'AAAAAAA',
      reference: 'AAAAAAA',
      label: 'AAAAAAA',
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

    it('should create a StandingOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new StandingOrder()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StandingOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          reference: 'BBBBBB',
          label: 'BBBBBB',
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

    it('should partial update a StandingOrder', () => {
      const patchObject = Object.assign(
        {
          reference: 'BBBBBB',
        },
        new StandingOrder()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StandingOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          reference: 'BBBBBB',
          label: 'BBBBBB',
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

    it('should delete a StandingOrder', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addStandingOrderToCollectionIfMissing', () => {
      it('should add a StandingOrder to an empty array', () => {
        const standingOrder: IStandingOrder = { id: 123 };
        expectedResult = service.addStandingOrderToCollectionIfMissing([], standingOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(standingOrder);
      });

      it('should not add a StandingOrder to an array that contains it', () => {
        const standingOrder: IStandingOrder = { id: 123 };
        const standingOrderCollection: IStandingOrder[] = [
          {
            ...standingOrder,
          },
          { id: 456 },
        ];
        expectedResult = service.addStandingOrderToCollectionIfMissing(standingOrderCollection, standingOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StandingOrder to an array that doesn't contain it", () => {
        const standingOrder: IStandingOrder = { id: 123 };
        const standingOrderCollection: IStandingOrder[] = [{ id: 456 }];
        expectedResult = service.addStandingOrderToCollectionIfMissing(standingOrderCollection, standingOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(standingOrder);
      });

      it('should add only unique StandingOrder to an array', () => {
        const standingOrderArray: IStandingOrder[] = [{ id: 123 }, { id: 456 }, { id: 38174 }];
        const standingOrderCollection: IStandingOrder[] = [{ id: 123 }];
        expectedResult = service.addStandingOrderToCollectionIfMissing(standingOrderCollection, ...standingOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const standingOrder: IStandingOrder = { id: 123 };
        const standingOrder2: IStandingOrder = { id: 456 };
        expectedResult = service.addStandingOrderToCollectionIfMissing([], standingOrder, standingOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(standingOrder);
        expect(expectedResult).toContain(standingOrder2);
      });

      it('should accept null and undefined values', () => {
        const standingOrder: IStandingOrder = { id: 123 };
        expectedResult = service.addStandingOrderToCollectionIfMissing([], null, standingOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(standingOrder);
      });

      it('should return initial array if no StandingOrder is added', () => {
        const standingOrderCollection: IStandingOrder[] = [{ id: 123 }];
        expectedResult = service.addStandingOrderToCollectionIfMissing(standingOrderCollection, undefined, null);
        expect(expectedResult).toEqual(standingOrderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
