import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AccountBalancesService } from '../service/account-balances.service';
import { IAccountBalances, AccountBalances } from '../account-balances.model';
import { IAmount } from 'app/entities/amount/amount.model';
import { AmountService } from 'app/entities/amount/service/amount.service';

import { AccountBalancesUpdateComponent } from './account-balances-update.component';

describe('AccountBalances Management Update Component', () => {
  let comp: AccountBalancesUpdateComponent;
  let fixture: ComponentFixture<AccountBalancesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let accountBalancesService: AccountBalancesService;
  let amountService: AmountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AccountBalancesUpdateComponent],
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
      .overrideTemplate(AccountBalancesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountBalancesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accountBalancesService = TestBed.inject(AccountBalancesService);
    amountService = TestBed.inject(AmountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call available query and add missing value', () => {
      const accountBalances: IAccountBalances = { id: 456 };
      const available: IAmount = { id: 72753 };
      accountBalances.available = available;

      const availableCollection: IAmount[] = [{ id: 72311 }];
      jest.spyOn(amountService, 'query').mockReturnValue(of(new HttpResponse({ body: availableCollection })));
      const expectedCollection: IAmount[] = [available, ...availableCollection];
      jest.spyOn(amountService, 'addAmountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountBalances });
      comp.ngOnInit();

      expect(amountService.query).toHaveBeenCalled();
      expect(amountService.addAmountToCollectionIfMissing).toHaveBeenCalledWith(availableCollection, available);
      expect(comp.availablesCollection).toEqual(expectedCollection);
    });

    it('Should call booked query and add missing value', () => {
      const accountBalances: IAccountBalances = { id: 456 };
      const booked: IAmount = { id: 77505 };
      accountBalances.booked = booked;

      const bookedCollection: IAmount[] = [{ id: 74908 }];
      jest.spyOn(amountService, 'query').mockReturnValue(of(new HttpResponse({ body: bookedCollection })));
      const expectedCollection: IAmount[] = [booked, ...bookedCollection];
      jest.spyOn(amountService, 'addAmountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountBalances });
      comp.ngOnInit();

      expect(amountService.query).toHaveBeenCalled();
      expect(amountService.addAmountToCollectionIfMissing).toHaveBeenCalledWith(bookedCollection, booked);
      expect(comp.bookedsCollection).toEqual(expectedCollection);
    });

    it('Should call pending query and add missing value', () => {
      const accountBalances: IAccountBalances = { id: 456 };
      const pending: IAmount = { id: 57891 };
      accountBalances.pending = pending;

      const pendingCollection: IAmount[] = [{ id: 60626 }];
      jest.spyOn(amountService, 'query').mockReturnValue(of(new HttpResponse({ body: pendingCollection })));
      const expectedCollection: IAmount[] = [pending, ...pendingCollection];
      jest.spyOn(amountService, 'addAmountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountBalances });
      comp.ngOnInit();

      expect(amountService.query).toHaveBeenCalled();
      expect(amountService.addAmountToCollectionIfMissing).toHaveBeenCalledWith(pendingCollection, pending);
      expect(comp.pendingsCollection).toEqual(expectedCollection);
    });

    it('Should call reserved query and add missing value', () => {
      const accountBalances: IAccountBalances = { id: 456 };
      const reserved: IAmount = { id: 37734 };
      accountBalances.reserved = reserved;

      const reservedCollection: IAmount[] = [{ id: 86003 }];
      jest.spyOn(amountService, 'query').mockReturnValue(of(new HttpResponse({ body: reservedCollection })));
      const expectedCollection: IAmount[] = [reserved, ...reservedCollection];
      jest.spyOn(amountService, 'addAmountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountBalances });
      comp.ngOnInit();

      expect(amountService.query).toHaveBeenCalled();
      expect(amountService.addAmountToCollectionIfMissing).toHaveBeenCalledWith(reservedCollection, reserved);
      expect(comp.reservedsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const accountBalances: IAccountBalances = { id: 456 };
      const available: IAmount = { id: 55573 };
      accountBalances.available = available;
      const booked: IAmount = { id: 82075 };
      accountBalances.booked = booked;
      const pending: IAmount = { id: 36526 };
      accountBalances.pending = pending;
      const reserved: IAmount = { id: 30436 };
      accountBalances.reserved = reserved;

      activatedRoute.data = of({ accountBalances });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(accountBalances));
      expect(comp.availablesCollection).toContain(available);
      expect(comp.bookedsCollection).toContain(booked);
      expect(comp.pendingsCollection).toContain(pending);
      expect(comp.reservedsCollection).toContain(reserved);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountBalances>>();
      const accountBalances = { id: 123 };
      jest.spyOn(accountBalancesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountBalances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountBalances }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(accountBalancesService.update).toHaveBeenCalledWith(accountBalances);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountBalances>>();
      const accountBalances = new AccountBalances();
      jest.spyOn(accountBalancesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountBalances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountBalances }));
      saveSubject.complete();

      // THEN
      expect(accountBalancesService.create).toHaveBeenCalledWith(accountBalances);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountBalances>>();
      const accountBalances = { id: 123 };
      jest.spyOn(accountBalancesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountBalances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accountBalancesService.update).toHaveBeenCalledWith(accountBalances);
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
  });
});
