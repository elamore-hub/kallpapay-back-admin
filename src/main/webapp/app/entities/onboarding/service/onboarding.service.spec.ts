import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOnboarding, Onboarding } from '../onboarding.model';

import { OnboardingService } from './onboarding.service';

describe('Onboarding Service', () => {
  let service: OnboardingService;
  let httpMock: HttpTestingController;
  let elemDefault: IOnboarding;
  let expectedResult: IOnboarding | IOnboarding[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OnboardingService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      externalId: 'AAAAAAA',
      accountName: 'AAAAAAA',
      email: 'AAAAAAA',
      language: 'AAAAAAA',
      accountHolderType: 'AAAAAAA',
      onboardingUrl: 'AAAAAAA',
      onboardingState: 'AAAAAAA',
      redirectUrl: 'AAAAAAA',
      status: 'AAAAAAA',
      tcuUrl: 'AAAAAAA',
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

    it('should create a Onboarding', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Onboarding()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Onboarding', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          accountName: 'BBBBBB',
          email: 'BBBBBB',
          language: 'BBBBBB',
          accountHolderType: 'BBBBBB',
          onboardingUrl: 'BBBBBB',
          onboardingState: 'BBBBBB',
          redirectUrl: 'BBBBBB',
          status: 'BBBBBB',
          tcuUrl: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Onboarding', () => {
      const patchObject = Object.assign(
        {
          externalId: 'BBBBBB',
          accountName: 'BBBBBB',
          email: 'BBBBBB',
          onboardingState: 'BBBBBB',
          redirectUrl: 'BBBBBB',
          status: 'BBBBBB',
          tcuUrl: 'BBBBBB',
        },
        new Onboarding()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Onboarding', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          accountName: 'BBBBBB',
          email: 'BBBBBB',
          language: 'BBBBBB',
          accountHolderType: 'BBBBBB',
          onboardingUrl: 'BBBBBB',
          onboardingState: 'BBBBBB',
          redirectUrl: 'BBBBBB',
          status: 'BBBBBB',
          tcuUrl: 'BBBBBB',
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

    it('should delete a Onboarding', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOnboardingToCollectionIfMissing', () => {
      it('should add a Onboarding to an empty array', () => {
        const onboarding: IOnboarding = { id: 123 };
        expectedResult = service.addOnboardingToCollectionIfMissing([], onboarding);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(onboarding);
      });

      it('should not add a Onboarding to an array that contains it', () => {
        const onboarding: IOnboarding = { id: 123 };
        const onboardingCollection: IOnboarding[] = [
          {
            ...onboarding,
          },
          { id: 456 },
        ];
        expectedResult = service.addOnboardingToCollectionIfMissing(onboardingCollection, onboarding);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Onboarding to an array that doesn't contain it", () => {
        const onboarding: IOnboarding = { id: 123 };
        const onboardingCollection: IOnboarding[] = [{ id: 456 }];
        expectedResult = service.addOnboardingToCollectionIfMissing(onboardingCollection, onboarding);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(onboarding);
      });

      it('should add only unique Onboarding to an array', () => {
        const onboardingArray: IOnboarding[] = [{ id: 123 }, { id: 456 }, { id: 67519 }];
        const onboardingCollection: IOnboarding[] = [{ id: 123 }];
        expectedResult = service.addOnboardingToCollectionIfMissing(onboardingCollection, ...onboardingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const onboarding: IOnboarding = { id: 123 };
        const onboarding2: IOnboarding = { id: 456 };
        expectedResult = service.addOnboardingToCollectionIfMissing([], onboarding, onboarding2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(onboarding);
        expect(expectedResult).toContain(onboarding2);
      });

      it('should accept null and undefined values', () => {
        const onboarding: IOnboarding = { id: 123 };
        expectedResult = service.addOnboardingToCollectionIfMissing([], null, onboarding, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(onboarding);
      });

      it('should return initial array if no Onboarding is added', () => {
        const onboardingCollection: IOnboarding[] = [{ id: 123 }];
        expectedResult = service.addOnboardingToCollectionIfMissing(onboardingCollection, undefined, null);
        expect(expectedResult).toEqual(onboardingCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
