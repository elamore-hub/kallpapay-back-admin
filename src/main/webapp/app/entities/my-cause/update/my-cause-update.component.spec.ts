import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MyCauseService } from '../service/my-cause.service';
import { IMyCause, MyCause } from '../my-cause.model';
import { ICause } from 'app/entities/cause/cause.model';
import { CauseService } from 'app/entities/cause/service/cause.service';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { PortfolioService } from 'app/entities/portfolio/service/portfolio.service';

import { MyCauseUpdateComponent } from './my-cause-update.component';

describe('MyCause Management Update Component', () => {
  let comp: MyCauseUpdateComponent;
  let fixture: ComponentFixture<MyCauseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let myCauseService: MyCauseService;
  let causeService: CauseService;
  let portfolioService: PortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MyCauseUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MyCauseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MyCauseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    myCauseService = TestBed.inject(MyCauseService);
    causeService = TestBed.inject(CauseService);
    portfolioService = TestBed.inject(PortfolioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call cause query and add missing value', () => {
      const myCause: IMyCause = { id: 456 };
      const cause: ICause = { id: 98621 };
      myCause.cause = cause;

      const causeCollection: ICause[] = [{ id: 76754 }];
      jest.spyOn(causeService, 'query').mockReturnValue(of(new HttpResponse({ body: causeCollection })));
      const expectedCollection: ICause[] = [cause, ...causeCollection];
      jest.spyOn(causeService, 'addCauseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ myCause });
      comp.ngOnInit();

      expect(causeService.query).toHaveBeenCalled();
      expect(causeService.addCauseToCollectionIfMissing).toHaveBeenCalledWith(causeCollection, cause);
      expect(comp.causesCollection).toEqual(expectedCollection);
    });

    it('Should call Portfolio query and add missing value', () => {
      const myCause: IMyCause = { id: 456 };
      const portfolio: IPortfolio = { id: 98419 };
      myCause.portfolio = portfolio;

      const portfolioCollection: IPortfolio[] = [{ id: 84487 }];
      jest.spyOn(portfolioService, 'query').mockReturnValue(of(new HttpResponse({ body: portfolioCollection })));
      const additionalPortfolios = [portfolio];
      const expectedCollection: IPortfolio[] = [...additionalPortfolios, ...portfolioCollection];
      jest.spyOn(portfolioService, 'addPortfolioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ myCause });
      comp.ngOnInit();

      expect(portfolioService.query).toHaveBeenCalled();
      expect(portfolioService.addPortfolioToCollectionIfMissing).toHaveBeenCalledWith(portfolioCollection, ...additionalPortfolios);
      expect(comp.portfoliosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const myCause: IMyCause = { id: 456 };
      const cause: ICause = { id: 41579 };
      myCause.cause = cause;
      const portfolio: IPortfolio = { id: 16165 };
      myCause.portfolio = portfolio;

      activatedRoute.data = of({ myCause });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(myCause));
      expect(comp.causesCollection).toContain(cause);
      expect(comp.portfoliosSharedCollection).toContain(portfolio);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyCause>>();
      const myCause = { id: 123 };
      jest.spyOn(myCauseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myCause });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: myCause }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(myCauseService.update).toHaveBeenCalledWith(myCause);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyCause>>();
      const myCause = new MyCause();
      jest.spyOn(myCauseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myCause });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: myCause }));
      saveSubject.complete();

      // THEN
      expect(myCauseService.create).toHaveBeenCalledWith(myCause);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MyCause>>();
      const myCause = { id: 123 };
      jest.spyOn(myCauseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ myCause });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(myCauseService.update).toHaveBeenCalledWith(myCause);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCauseById', () => {
      it('Should return tracked Cause primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCauseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPortfolioById', () => {
      it('Should return tracked Portfolio primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPortfolioById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
