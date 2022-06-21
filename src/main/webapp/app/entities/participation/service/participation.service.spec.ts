import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IParticipation, Participation } from '../participation.model';

import { ParticipationService } from './participation.service';

describe('Participation Service', () => {
  let service: ParticipationService;
  let httpMock: HttpTestingController;
  let elemDefault: IParticipation;
  let expectedResult: IParticipation | IParticipation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParticipationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      creationDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          creationDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Participation', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          creationDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creationDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Participation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Participation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          creationDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creationDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Participation', () => {
      const patchObject = Object.assign(
        {
          creationDate: currentDate.format(DATE_FORMAT),
        },
        new Participation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          creationDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Participation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          creationDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creationDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Participation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParticipationToCollectionIfMissing', () => {
      it('should add a Participation to an empty array', () => {
        const participation: IParticipation = { id: 123 };
        expectedResult = service.addParticipationToCollectionIfMissing([], participation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(participation);
      });

      it('should not add a Participation to an array that contains it', () => {
        const participation: IParticipation = { id: 123 };
        const participationCollection: IParticipation[] = [
          {
            ...participation,
          },
          { id: 456 },
        ];
        expectedResult = service.addParticipationToCollectionIfMissing(participationCollection, participation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Participation to an array that doesn't contain it", () => {
        const participation: IParticipation = { id: 123 };
        const participationCollection: IParticipation[] = [{ id: 456 }];
        expectedResult = service.addParticipationToCollectionIfMissing(participationCollection, participation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(participation);
      });

      it('should add only unique Participation to an array', () => {
        const participationArray: IParticipation[] = [{ id: 123 }, { id: 456 }, { id: 11897 }];
        const participationCollection: IParticipation[] = [{ id: 123 }];
        expectedResult = service.addParticipationToCollectionIfMissing(participationCollection, ...participationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const participation: IParticipation = { id: 123 };
        const participation2: IParticipation = { id: 456 };
        expectedResult = service.addParticipationToCollectionIfMissing([], participation, participation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(participation);
        expect(expectedResult).toContain(participation2);
      });

      it('should accept null and undefined values', () => {
        const participation: IParticipation = { id: 123 };
        expectedResult = service.addParticipationToCollectionIfMissing([], null, participation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(participation);
      });

      it('should return initial array if no Participation is added', () => {
        const participationCollection: IParticipation[] = [{ id: 123 }];
        expectedResult = service.addParticipationToCollectionIfMissing(participationCollection, undefined, null);
        expect(expectedResult).toEqual(participationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
