import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Method } from 'app/entities/enumerations/method.model';
import { IPortfolio, Portfolio } from '../portfolio.model';

import { PortfolioService } from './portfolio.service';

describe('Portfolio Service', () => {
  let service: PortfolioService;
  let httpMock: HttpTestingController;
  let elemDefault: IPortfolio;
  let expectedResult: IPortfolio | IPortfolio[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PortfolioService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      limitAmount: 0,
      amount: 0,
      limitPercentage: 0,
      percentage: 0,
      method: Method.PERCENTAGE,
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

    it('should create a Portfolio', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Portfolio()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Portfolio', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          limitAmount: 1,
          amount: 1,
          limitPercentage: 1,
          percentage: 1,
          method: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Portfolio', () => {
      const patchObject = Object.assign(
        {
          limitAmount: 1,
          amount: 1,
          method: 'BBBBBB',
        },
        new Portfolio()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Portfolio', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          limitAmount: 1,
          amount: 1,
          limitPercentage: 1,
          percentage: 1,
          method: 'BBBBBB',
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

    it('should delete a Portfolio', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPortfolioToCollectionIfMissing', () => {
      it('should add a Portfolio to an empty array', () => {
        const portfolio: IPortfolio = { id: 123 };
        expectedResult = service.addPortfolioToCollectionIfMissing([], portfolio);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(portfolio);
      });

      it('should not add a Portfolio to an array that contains it', () => {
        const portfolio: IPortfolio = { id: 123 };
        const portfolioCollection: IPortfolio[] = [
          {
            ...portfolio,
          },
          { id: 456 },
        ];
        expectedResult = service.addPortfolioToCollectionIfMissing(portfolioCollection, portfolio);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Portfolio to an array that doesn't contain it", () => {
        const portfolio: IPortfolio = { id: 123 };
        const portfolioCollection: IPortfolio[] = [{ id: 456 }];
        expectedResult = service.addPortfolioToCollectionIfMissing(portfolioCollection, portfolio);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(portfolio);
      });

      it('should add only unique Portfolio to an array', () => {
        const portfolioArray: IPortfolio[] = [{ id: 123 }, { id: 456 }, { id: 77314 }];
        const portfolioCollection: IPortfolio[] = [{ id: 123 }];
        expectedResult = service.addPortfolioToCollectionIfMissing(portfolioCollection, ...portfolioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const portfolio: IPortfolio = { id: 123 };
        const portfolio2: IPortfolio = { id: 456 };
        expectedResult = service.addPortfolioToCollectionIfMissing([], portfolio, portfolio2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(portfolio);
        expect(expectedResult).toContain(portfolio2);
      });

      it('should accept null and undefined values', () => {
        const portfolio: IPortfolio = { id: 123 };
        expectedResult = service.addPortfolioToCollectionIfMissing([], null, portfolio, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(portfolio);
      });

      it('should return initial array if no Portfolio is added', () => {
        const portfolioCollection: IPortfolio[] = [{ id: 123 }];
        expectedResult = service.addPortfolioToCollectionIfMissing(portfolioCollection, undefined, null);
        expect(expectedResult).toEqual(portfolioCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
