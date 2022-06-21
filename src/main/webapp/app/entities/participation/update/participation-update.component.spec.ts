import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParticipationService } from '../service/participation.service';
import { IParticipation, Participation } from '../participation.model';
import { IAmount } from 'app/entities/amount/amount.model';
import { AmountService } from 'app/entities/amount/service/amount.service';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { PortfolioService } from 'app/entities/portfolio/service/portfolio.service';

import { ParticipationUpdateComponent } from './participation-update.component';

describe('Participation Management Update Component', () => {
  let comp: ParticipationUpdateComponent;
  let fixture: ComponentFixture<ParticipationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let participationService: ParticipationService;
  let amountService: AmountService;
  let portfolioService: PortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParticipationUpdateComponent],
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
      .overrideTemplate(ParticipationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParticipationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    participationService = TestBed.inject(ParticipationService);
    amountService = TestBed.inject(AmountService);
    portfolioService = TestBed.inject(PortfolioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call amount query and add missing value', () => {
      const participation: IParticipation = { id: 456 };
      const amount: IAmount = { id: 57909 };
      participation.amount = amount;

      const amountCollection: IAmount[] = [{ id: 32398 }];
      jest.spyOn(amountService, 'query').mockReturnValue(of(new HttpResponse({ body: amountCollection })));
      const expectedCollection: IAmount[] = [amount, ...amountCollection];
      jest.spyOn(amountService, 'addAmountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ participation });
      comp.ngOnInit();

      expect(amountService.query).toHaveBeenCalled();
      expect(amountService.addAmountToCollectionIfMissing).toHaveBeenCalledWith(amountCollection, amount);
      expect(comp.amountsCollection).toEqual(expectedCollection);
    });

    it('Should call Portfolio query and add missing value', () => {
      const participation: IParticipation = { id: 456 };
      const portfolio: IPortfolio = { id: 2039 };
      participation.portfolio = portfolio;

      const portfolioCollection: IPortfolio[] = [{ id: 20739 }];
      jest.spyOn(portfolioService, 'query').mockReturnValue(of(new HttpResponse({ body: portfolioCollection })));
      const additionalPortfolios = [portfolio];
      const expectedCollection: IPortfolio[] = [...additionalPortfolios, ...portfolioCollection];
      jest.spyOn(portfolioService, 'addPortfolioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ participation });
      comp.ngOnInit();

      expect(portfolioService.query).toHaveBeenCalled();
      expect(portfolioService.addPortfolioToCollectionIfMissing).toHaveBeenCalledWith(portfolioCollection, ...additionalPortfolios);
      expect(comp.portfoliosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const participation: IParticipation = { id: 456 };
      const amount: IAmount = { id: 53692 };
      participation.amount = amount;
      const portfolio: IPortfolio = { id: 64692 };
      participation.portfolio = portfolio;

      activatedRoute.data = of({ participation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(participation));
      expect(comp.amountsCollection).toContain(amount);
      expect(comp.portfoliosSharedCollection).toContain(portfolio);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Participation>>();
      const participation = { id: 123 };
      jest.spyOn(participationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ participation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: participation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(participationService.update).toHaveBeenCalledWith(participation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Participation>>();
      const participation = new Participation();
      jest.spyOn(participationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ participation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: participation }));
      saveSubject.complete();

      // THEN
      expect(participationService.create).toHaveBeenCalledWith(participation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Participation>>();
      const participation = { id: 123 };
      jest.spyOn(participationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ participation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(participationService.update).toHaveBeenCalledWith(participation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAmountById', () => {
      it('Should return tracked Amount primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAmountById(0, entity);
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
