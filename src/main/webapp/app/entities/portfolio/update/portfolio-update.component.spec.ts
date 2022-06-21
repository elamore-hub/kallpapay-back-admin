import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PortfolioService } from '../service/portfolio.service';
import { IPortfolio, Portfolio } from '../portfolio.model';
import { ICard } from 'app/entities/card/card.model';
import { CardService } from 'app/entities/card/service/card.service';

import { PortfolioUpdateComponent } from './portfolio-update.component';

describe('Portfolio Management Update Component', () => {
  let comp: PortfolioUpdateComponent;
  let fixture: ComponentFixture<PortfolioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let portfolioService: PortfolioService;
  let cardService: CardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PortfolioUpdateComponent],
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
      .overrideTemplate(PortfolioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PortfolioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    portfolioService = TestBed.inject(PortfolioService);
    cardService = TestBed.inject(CardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Card query and add missing value', () => {
      const portfolio: IPortfolio = { id: 456 };
      const card: ICard = { id: 48226 };
      portfolio.card = card;

      const cardCollection: ICard[] = [{ id: 3096 }];
      jest.spyOn(cardService, 'query').mockReturnValue(of(new HttpResponse({ body: cardCollection })));
      const additionalCards = [card];
      const expectedCollection: ICard[] = [...additionalCards, ...cardCollection];
      jest.spyOn(cardService, 'addCardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ portfolio });
      comp.ngOnInit();

      expect(cardService.query).toHaveBeenCalled();
      expect(cardService.addCardToCollectionIfMissing).toHaveBeenCalledWith(cardCollection, ...additionalCards);
      expect(comp.cardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const portfolio: IPortfolio = { id: 456 };
      const card: ICard = { id: 55324 };
      portfolio.card = card;

      activatedRoute.data = of({ portfolio });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(portfolio));
      expect(comp.cardsSharedCollection).toContain(card);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Portfolio>>();
      const portfolio = { id: 123 };
      jest.spyOn(portfolioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ portfolio });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: portfolio }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(portfolioService.update).toHaveBeenCalledWith(portfolio);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Portfolio>>();
      const portfolio = new Portfolio();
      jest.spyOn(portfolioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ portfolio });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: portfolio }));
      saveSubject.complete();

      // THEN
      expect(portfolioService.create).toHaveBeenCalledWith(portfolio);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Portfolio>>();
      const portfolio = { id: 123 };
      jest.spyOn(portfolioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ portfolio });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(portfolioService.update).toHaveBeenCalledWith(portfolio);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCardById', () => {
      it('Should return tracked Card primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCardById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
