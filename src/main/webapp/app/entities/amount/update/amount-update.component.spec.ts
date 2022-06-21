import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AmountService } from '../service/amount.service';
import { IAmount, Amount } from '../amount.model';

import { AmountUpdateComponent } from './amount-update.component';

describe('Amount Management Update Component', () => {
  let comp: AmountUpdateComponent;
  let fixture: ComponentFixture<AmountUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let amountService: AmountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AmountUpdateComponent],
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
      .overrideTemplate(AmountUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AmountUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    amountService = TestBed.inject(AmountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const amount: IAmount = { id: 456 };

      activatedRoute.data = of({ amount });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(amount));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Amount>>();
      const amount = { id: 123 };
      jest.spyOn(amountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: amount }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(amountService.update).toHaveBeenCalledWith(amount);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Amount>>();
      const amount = new Amount();
      jest.spyOn(amountService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: amount }));
      saveSubject.complete();

      // THEN
      expect(amountService.create).toHaveBeenCalledWith(amount);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Amount>>();
      const amount = { id: 123 };
      jest.spyOn(amountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(amountService.update).toHaveBeenCalledWith(amount);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
