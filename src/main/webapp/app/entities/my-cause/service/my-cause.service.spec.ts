import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMyCause, MyCause } from '../my-cause.model';

import { MyCauseService } from './my-cause.service';

describe('MyCause Service', () => {
  let service: MyCauseService;
  let httpMock: HttpTestingController;
  let elemDefault: IMyCause;
  let expectedResult: IMyCause | IMyCause[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MyCauseService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      percentage: 0,
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

    it('should create a MyCause', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new MyCause()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MyCause', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          percentage: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MyCause', () => {
      const patchObject = Object.assign({}, new MyCause());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MyCause', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          percentage: 1,
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

    it('should delete a MyCause', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMyCauseToCollectionIfMissing', () => {
      it('should add a MyCause to an empty array', () => {
        const myCause: IMyCause = { id: 123 };
        expectedResult = service.addMyCauseToCollectionIfMissing([], myCause);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(myCause);
      });

      it('should not add a MyCause to an array that contains it', () => {
        const myCause: IMyCause = { id: 123 };
        const myCauseCollection: IMyCause[] = [
          {
            ...myCause,
          },
          { id: 456 },
        ];
        expectedResult = service.addMyCauseToCollectionIfMissing(myCauseCollection, myCause);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MyCause to an array that doesn't contain it", () => {
        const myCause: IMyCause = { id: 123 };
        const myCauseCollection: IMyCause[] = [{ id: 456 }];
        expectedResult = service.addMyCauseToCollectionIfMissing(myCauseCollection, myCause);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(myCause);
      });

      it('should add only unique MyCause to an array', () => {
        const myCauseArray: IMyCause[] = [{ id: 123 }, { id: 456 }, { id: 25508 }];
        const myCauseCollection: IMyCause[] = [{ id: 123 }];
        expectedResult = service.addMyCauseToCollectionIfMissing(myCauseCollection, ...myCauseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const myCause: IMyCause = { id: 123 };
        const myCause2: IMyCause = { id: 456 };
        expectedResult = service.addMyCauseToCollectionIfMissing([], myCause, myCause2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(myCause);
        expect(expectedResult).toContain(myCause2);
      });

      it('should accept null and undefined values', () => {
        const myCause: IMyCause = { id: 123 };
        expectedResult = service.addMyCauseToCollectionIfMissing([], null, myCause, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(myCause);
      });

      it('should return initial array if no MyCause is added', () => {
        const myCauseCollection: IMyCause[] = [{ id: 123 }];
        expectedResult = service.addMyCauseToCollectionIfMissing(myCauseCollection, undefined, null);
        expect(expectedResult).toEqual(myCauseCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
