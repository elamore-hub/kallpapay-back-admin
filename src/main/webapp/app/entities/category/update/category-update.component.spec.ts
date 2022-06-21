import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CategoryService } from '../service/category.service';
import { ICategory, Category } from '../category.model';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { PortfolioService } from 'app/entities/portfolio/service/portfolio.service';
import { ICause } from 'app/entities/cause/cause.model';
import { CauseService } from 'app/entities/cause/service/cause.service';

import { CategoryUpdateComponent } from './category-update.component';

describe('Category Management Update Component', () => {
  let comp: CategoryUpdateComponent;
  let fixture: ComponentFixture<CategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let categoryService: CategoryService;
  let portfolioService: PortfolioService;
  let causeService: CauseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CategoryUpdateComponent],
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
      .overrideTemplate(CategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    categoryService = TestBed.inject(CategoryService);
    portfolioService = TestBed.inject(PortfolioService);
    causeService = TestBed.inject(CauseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Portfolio query and add missing value', () => {
      const category: ICategory = { id: 456 };
      const portfolio: IPortfolio = { id: 59174 };
      category.portfolio = portfolio;

      const portfolioCollection: IPortfolio[] = [{ id: 59232 }];
      jest.spyOn(portfolioService, 'query').mockReturnValue(of(new HttpResponse({ body: portfolioCollection })));
      const additionalPortfolios = [portfolio];
      const expectedCollection: IPortfolio[] = [...additionalPortfolios, ...portfolioCollection];
      jest.spyOn(portfolioService, 'addPortfolioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ category });
      comp.ngOnInit();

      expect(portfolioService.query).toHaveBeenCalled();
      expect(portfolioService.addPortfolioToCollectionIfMissing).toHaveBeenCalledWith(portfolioCollection, ...additionalPortfolios);
      expect(comp.portfoliosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cause query and add missing value', () => {
      const category: ICategory = { id: 456 };
      const cause: ICause = { id: 46754 };
      category.cause = cause;

      const causeCollection: ICause[] = [{ id: 50798 }];
      jest.spyOn(causeService, 'query').mockReturnValue(of(new HttpResponse({ body: causeCollection })));
      const additionalCauses = [cause];
      const expectedCollection: ICause[] = [...additionalCauses, ...causeCollection];
      jest.spyOn(causeService, 'addCauseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ category });
      comp.ngOnInit();

      expect(causeService.query).toHaveBeenCalled();
      expect(causeService.addCauseToCollectionIfMissing).toHaveBeenCalledWith(causeCollection, ...additionalCauses);
      expect(comp.causesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const category: ICategory = { id: 456 };
      const portfolio: IPortfolio = { id: 53186 };
      category.portfolio = portfolio;
      const cause: ICause = { id: 13668 };
      category.cause = cause;

      activatedRoute.data = of({ category });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(category));
      expect(comp.portfoliosSharedCollection).toContain(portfolio);
      expect(comp.causesSharedCollection).toContain(cause);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Category>>();
      const category = { id: 123 };
      jest.spyOn(categoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ category });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: category }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(categoryService.update).toHaveBeenCalledWith(category);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Category>>();
      const category = new Category();
      jest.spyOn(categoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ category });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: category }));
      saveSubject.complete();

      // THEN
      expect(categoryService.create).toHaveBeenCalledWith(category);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Category>>();
      const category = { id: 123 };
      jest.spyOn(categoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ category });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(categoryService.update).toHaveBeenCalledWith(category);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPortfolioById', () => {
      it('Should return tracked Portfolio primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPortfolioById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCauseById', () => {
      it('Should return tracked Cause primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCauseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
