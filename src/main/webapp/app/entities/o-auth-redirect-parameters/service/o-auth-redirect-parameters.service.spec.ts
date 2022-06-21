import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOAuthRedirectParameters, OAuthRedirectParameters } from '../o-auth-redirect-parameters.model';

import { OAuthRedirectParametersService } from './o-auth-redirect-parameters.service';

describe('OAuthRedirectParameters Service', () => {
  let service: OAuthRedirectParametersService;
  let httpMock: HttpTestingController;
  let elemDefault: IOAuthRedirectParameters;
  let expectedResult: IOAuthRedirectParameters | IOAuthRedirectParameters[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OAuthRedirectParametersService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      state: 'AAAAAAA',
      redirectUrl: 'AAAAAAA',
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

    it('should create a OAuthRedirectParameters', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new OAuthRedirectParameters()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OAuthRedirectParameters', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          state: 'BBBBBB',
          redirectUrl: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OAuthRedirectParameters', () => {
      const patchObject = Object.assign(
        {
          state: 'BBBBBB',
        },
        new OAuthRedirectParameters()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OAuthRedirectParameters', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          state: 'BBBBBB',
          redirectUrl: 'BBBBBB',
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

    it('should delete a OAuthRedirectParameters', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOAuthRedirectParametersToCollectionIfMissing', () => {
      it('should add a OAuthRedirectParameters to an empty array', () => {
        const oAuthRedirectParameters: IOAuthRedirectParameters = { id: 123 };
        expectedResult = service.addOAuthRedirectParametersToCollectionIfMissing([], oAuthRedirectParameters);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(oAuthRedirectParameters);
      });

      it('should not add a OAuthRedirectParameters to an array that contains it', () => {
        const oAuthRedirectParameters: IOAuthRedirectParameters = { id: 123 };
        const oAuthRedirectParametersCollection: IOAuthRedirectParameters[] = [
          {
            ...oAuthRedirectParameters,
          },
          { id: 456 },
        ];
        expectedResult = service.addOAuthRedirectParametersToCollectionIfMissing(
          oAuthRedirectParametersCollection,
          oAuthRedirectParameters
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OAuthRedirectParameters to an array that doesn't contain it", () => {
        const oAuthRedirectParameters: IOAuthRedirectParameters = { id: 123 };
        const oAuthRedirectParametersCollection: IOAuthRedirectParameters[] = [{ id: 456 }];
        expectedResult = service.addOAuthRedirectParametersToCollectionIfMissing(
          oAuthRedirectParametersCollection,
          oAuthRedirectParameters
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(oAuthRedirectParameters);
      });

      it('should add only unique OAuthRedirectParameters to an array', () => {
        const oAuthRedirectParametersArray: IOAuthRedirectParameters[] = [{ id: 123 }, { id: 456 }, { id: 51384 }];
        const oAuthRedirectParametersCollection: IOAuthRedirectParameters[] = [{ id: 123 }];
        expectedResult = service.addOAuthRedirectParametersToCollectionIfMissing(
          oAuthRedirectParametersCollection,
          ...oAuthRedirectParametersArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const oAuthRedirectParameters: IOAuthRedirectParameters = { id: 123 };
        const oAuthRedirectParameters2: IOAuthRedirectParameters = { id: 456 };
        expectedResult = service.addOAuthRedirectParametersToCollectionIfMissing([], oAuthRedirectParameters, oAuthRedirectParameters2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(oAuthRedirectParameters);
        expect(expectedResult).toContain(oAuthRedirectParameters2);
      });

      it('should accept null and undefined values', () => {
        const oAuthRedirectParameters: IOAuthRedirectParameters = { id: 123 };
        expectedResult = service.addOAuthRedirectParametersToCollectionIfMissing([], null, oAuthRedirectParameters, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(oAuthRedirectParameters);
      });

      it('should return initial array if no OAuthRedirectParameters is added', () => {
        const oAuthRedirectParametersCollection: IOAuthRedirectParameters[] = [{ id: 123 }];
        expectedResult = service.addOAuthRedirectParametersToCollectionIfMissing(oAuthRedirectParametersCollection, undefined, null);
        expect(expectedResult).toEqual(oAuthRedirectParametersCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
