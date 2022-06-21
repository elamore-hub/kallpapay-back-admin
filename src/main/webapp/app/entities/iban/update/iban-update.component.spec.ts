import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IBANService } from '../service/iban.service';
import { IIBAN, IBAN } from '../iban.model';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';

import { IBANUpdateComponent } from './iban-update.component';

describe('IBAN Management Update Component', () => {
  let comp: IBANUpdateComponent;
  let fixture: ComponentFixture<IBANUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let iBANService: IBANService;
  let bankAccountService: BankAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IBANUpdateComponent],
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
      .overrideTemplate(IBANUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IBANUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    iBANService = TestBed.inject(IBANService);
    bankAccountService = TestBed.inject(BankAccountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BankAccount query and add missing value', () => {
      const iBAN: IIBAN = { id: 456 };
      const bankAccount: IBankAccount = { id: 3958 };
      iBAN.bankAccount = bankAccount;

      const bankAccountCollection: IBankAccount[] = [{ id: 69760 }];
      jest.spyOn(bankAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: bankAccountCollection })));
      const additionalBankAccounts = [bankAccount];
      const expectedCollection: IBankAccount[] = [...additionalBankAccounts, ...bankAccountCollection];
      jest.spyOn(bankAccountService, 'addBankAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ iBAN });
      comp.ngOnInit();

      expect(bankAccountService.query).toHaveBeenCalled();
      expect(bankAccountService.addBankAccountToCollectionIfMissing).toHaveBeenCalledWith(bankAccountCollection, ...additionalBankAccounts);
      expect(comp.bankAccountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const iBAN: IIBAN = { id: 456 };
      const bankAccount: IBankAccount = { id: 17274 };
      iBAN.bankAccount = bankAccount;

      activatedRoute.data = of({ iBAN });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(iBAN));
      expect(comp.bankAccountsSharedCollection).toContain(bankAccount);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBAN>>();
      const iBAN = { id: 123 };
      jest.spyOn(iBANService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ iBAN });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: iBAN }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(iBANService.update).toHaveBeenCalledWith(iBAN);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBAN>>();
      const iBAN = new IBAN();
      jest.spyOn(iBANService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ iBAN });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: iBAN }));
      saveSubject.complete();

      // THEN
      expect(iBANService.create).toHaveBeenCalledWith(iBAN);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBAN>>();
      const iBAN = { id: 123 };
      jest.spyOn(iBANService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ iBAN });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(iBANService.update).toHaveBeenCalledWith(iBAN);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackBankAccountById', () => {
      it('Should return tracked BankAccount primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBankAccountById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
