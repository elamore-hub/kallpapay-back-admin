import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BankAccountService } from '../service/bank-account.service';
import { IBankAccount, BankAccount } from '../bank-account.model';
import { IAccountBalances } from 'app/entities/account-balances/account-balances.model';
import { AccountBalancesService } from 'app/entities/account-balances/service/account-balances.service';
import { IAccountHolder } from 'app/entities/account-holder/account-holder.model';
import { AccountHolderService } from 'app/entities/account-holder/service/account-holder.service';

import { BankAccountUpdateComponent } from './bank-account-update.component';

describe('BankAccount Management Update Component', () => {
  let comp: BankAccountUpdateComponent;
  let fixture: ComponentFixture<BankAccountUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bankAccountService: BankAccountService;
  let accountBalancesService: AccountBalancesService;
  let accountHolderService: AccountHolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BankAccountUpdateComponent],
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
      .overrideTemplate(BankAccountUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BankAccountUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bankAccountService = TestBed.inject(BankAccountService);
    accountBalancesService = TestBed.inject(AccountBalancesService);
    accountHolderService = TestBed.inject(AccountHolderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call balances query and add missing value', () => {
      const bankAccount: IBankAccount = { id: 456 };
      const balances: IAccountBalances = { id: 81132 };
      bankAccount.balances = balances;

      const balancesCollection: IAccountBalances[] = [{ id: 52058 }];
      jest.spyOn(accountBalancesService, 'query').mockReturnValue(of(new HttpResponse({ body: balancesCollection })));
      const expectedCollection: IAccountBalances[] = [balances, ...balancesCollection];
      jest.spyOn(accountBalancesService, 'addAccountBalancesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      expect(accountBalancesService.query).toHaveBeenCalled();
      expect(accountBalancesService.addAccountBalancesToCollectionIfMissing).toHaveBeenCalledWith(balancesCollection, balances);
      expect(comp.balancesCollection).toEqual(expectedCollection);
    });

    it('Should call AccountHolder query and add missing value', () => {
      const bankAccount: IBankAccount = { id: 456 };
      const accountHolder: IAccountHolder = { id: 8162 };
      bankAccount.accountHolder = accountHolder;

      const accountHolderCollection: IAccountHolder[] = [{ id: 64537 }];
      jest.spyOn(accountHolderService, 'query').mockReturnValue(of(new HttpResponse({ body: accountHolderCollection })));
      const additionalAccountHolders = [accountHolder];
      const expectedCollection: IAccountHolder[] = [...additionalAccountHolders, ...accountHolderCollection];
      jest.spyOn(accountHolderService, 'addAccountHolderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      expect(accountHolderService.query).toHaveBeenCalled();
      expect(accountHolderService.addAccountHolderToCollectionIfMissing).toHaveBeenCalledWith(
        accountHolderCollection,
        ...additionalAccountHolders
      );
      expect(comp.accountHoldersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bankAccount: IBankAccount = { id: 456 };
      const balances: IAccountBalances = { id: 49215 };
      bankAccount.balances = balances;
      const accountHolder: IAccountHolder = { id: 55957 };
      bankAccount.accountHolder = accountHolder;

      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bankAccount));
      expect(comp.balancesCollection).toContain(balances);
      expect(comp.accountHoldersSharedCollection).toContain(accountHolder);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BankAccount>>();
      const bankAccount = { id: 123 };
      jest.spyOn(bankAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankAccount }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(bankAccountService.update).toHaveBeenCalledWith(bankAccount);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BankAccount>>();
      const bankAccount = new BankAccount();
      jest.spyOn(bankAccountService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankAccount }));
      saveSubject.complete();

      // THEN
      expect(bankAccountService.create).toHaveBeenCalledWith(bankAccount);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BankAccount>>();
      const bankAccount = { id: 123 };
      jest.spyOn(bankAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bankAccountService.update).toHaveBeenCalledWith(bankAccount);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAccountBalancesById', () => {
      it('Should return tracked AccountBalances primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccountBalancesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAccountHolderById', () => {
      it('Should return tracked AccountHolder primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccountHolderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
