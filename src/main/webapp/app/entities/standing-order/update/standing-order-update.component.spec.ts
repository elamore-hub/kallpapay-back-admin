import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StandingOrderService } from '../service/standing-order.service';
import { IStandingOrder, StandingOrder } from '../standing-order.model';
import { IAmount } from 'app/entities/amount/amount.model';
import { AmountService } from 'app/entities/amount/service/amount.service';
import { ISEPABeneficiary } from 'app/entities/sepa-beneficiary/sepa-beneficiary.model';
import { SEPABeneficiaryService } from 'app/entities/sepa-beneficiary/service/sepa-beneficiary.service';

import { StandingOrderUpdateComponent } from './standing-order-update.component';

describe('StandingOrder Management Update Component', () => {
  let comp: StandingOrderUpdateComponent;
  let fixture: ComponentFixture<StandingOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let standingOrderService: StandingOrderService;
  let amountService: AmountService;
  let sEPABeneficiaryService: SEPABeneficiaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StandingOrderUpdateComponent],
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
      .overrideTemplate(StandingOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StandingOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    standingOrderService = TestBed.inject(StandingOrderService);
    amountService = TestBed.inject(AmountService);
    sEPABeneficiaryService = TestBed.inject(SEPABeneficiaryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call amount query and add missing value', () => {
      const standingOrder: IStandingOrder = { id: 456 };
      const amount: IAmount = { id: 53205 };
      standingOrder.amount = amount;

      const amountCollection: IAmount[] = [{ id: 45184 }];
      jest.spyOn(amountService, 'query').mockReturnValue(of(new HttpResponse({ body: amountCollection })));
      const expectedCollection: IAmount[] = [amount, ...amountCollection];
      jest.spyOn(amountService, 'addAmountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ standingOrder });
      comp.ngOnInit();

      expect(amountService.query).toHaveBeenCalled();
      expect(amountService.addAmountToCollectionIfMissing).toHaveBeenCalledWith(amountCollection, amount);
      expect(comp.amountsCollection).toEqual(expectedCollection);
    });

    it('Should call sepaBeneficiary query and add missing value', () => {
      const standingOrder: IStandingOrder = { id: 456 };
      const sepaBeneficiary: ISEPABeneficiary = { id: 23891 };
      standingOrder.sepaBeneficiary = sepaBeneficiary;

      const sepaBeneficiaryCollection: ISEPABeneficiary[] = [{ id: 98927 }];
      jest.spyOn(sEPABeneficiaryService, 'query').mockReturnValue(of(new HttpResponse({ body: sepaBeneficiaryCollection })));
      const expectedCollection: ISEPABeneficiary[] = [sepaBeneficiary, ...sepaBeneficiaryCollection];
      jest.spyOn(sEPABeneficiaryService, 'addSEPABeneficiaryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ standingOrder });
      comp.ngOnInit();

      expect(sEPABeneficiaryService.query).toHaveBeenCalled();
      expect(sEPABeneficiaryService.addSEPABeneficiaryToCollectionIfMissing).toHaveBeenCalledWith(
        sepaBeneficiaryCollection,
        sepaBeneficiary
      );
      expect(comp.sepaBeneficiariesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const standingOrder: IStandingOrder = { id: 456 };
      const amount: IAmount = { id: 52148 };
      standingOrder.amount = amount;
      const sepaBeneficiary: ISEPABeneficiary = { id: 56567 };
      standingOrder.sepaBeneficiary = sepaBeneficiary;

      activatedRoute.data = of({ standingOrder });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(standingOrder));
      expect(comp.amountsCollection).toContain(amount);
      expect(comp.sepaBeneficiariesCollection).toContain(sepaBeneficiary);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StandingOrder>>();
      const standingOrder = { id: 123 };
      jest.spyOn(standingOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ standingOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: standingOrder }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(standingOrderService.update).toHaveBeenCalledWith(standingOrder);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StandingOrder>>();
      const standingOrder = new StandingOrder();
      jest.spyOn(standingOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ standingOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: standingOrder }));
      saveSubject.complete();

      // THEN
      expect(standingOrderService.create).toHaveBeenCalledWith(standingOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StandingOrder>>();
      const standingOrder = { id: 123 };
      jest.spyOn(standingOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ standingOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(standingOrderService.update).toHaveBeenCalledWith(standingOrder);
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

    describe('trackSEPABeneficiaryById', () => {
      it('Should return tracked SEPABeneficiary primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSEPABeneficiaryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
