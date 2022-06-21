import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AccountMembershipService } from '../service/account-membership.service';
import { IAccountMembership, AccountMembership } from '../account-membership.model';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';

import { AccountMembershipUpdateComponent } from './account-membership-update.component';

describe('AccountMembership Management Update Component', () => {
  let comp: AccountMembershipUpdateComponent;
  let fixture: ComponentFixture<AccountMembershipUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let accountMembershipService: AccountMembershipService;
  let bankAccountService: BankAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AccountMembershipUpdateComponent],
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
      .overrideTemplate(AccountMembershipUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountMembershipUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accountMembershipService = TestBed.inject(AccountMembershipService);
    bankAccountService = TestBed.inject(BankAccountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BankAccount query and add missing value', () => {
      const accountMembership: IAccountMembership = { id: 456 };
      const bankAccount: IBankAccount = { id: 49851 };
      accountMembership.bankAccount = bankAccount;

      const bankAccountCollection: IBankAccount[] = [{ id: 14632 }];
      jest.spyOn(bankAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: bankAccountCollection })));
      const additionalBankAccounts = [bankAccount];
      const expectedCollection: IBankAccount[] = [...additionalBankAccounts, ...bankAccountCollection];
      jest.spyOn(bankAccountService, 'addBankAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountMembership });
      comp.ngOnInit();

      expect(bankAccountService.query).toHaveBeenCalled();
      expect(bankAccountService.addBankAccountToCollectionIfMissing).toHaveBeenCalledWith(bankAccountCollection, ...additionalBankAccounts);
      expect(comp.bankAccountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const accountMembership: IAccountMembership = { id: 456 };
      const bankAccount: IBankAccount = { id: 70350 };
      accountMembership.bankAccount = bankAccount;

      activatedRoute.data = of({ accountMembership });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(accountMembership));
      expect(comp.bankAccountsSharedCollection).toContain(bankAccount);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountMembership>>();
      const accountMembership = { id: 123 };
      jest.spyOn(accountMembershipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountMembership });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountMembership }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(accountMembershipService.update).toHaveBeenCalledWith(accountMembership);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountMembership>>();
      const accountMembership = new AccountMembership();
      jest.spyOn(accountMembershipService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountMembership });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountMembership }));
      saveSubject.complete();

      // THEN
      expect(accountMembershipService.create).toHaveBeenCalledWith(accountMembership);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountMembership>>();
      const accountMembership = { id: 123 };
      jest.spyOn(accountMembershipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountMembership });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accountMembershipService.update).toHaveBeenCalledWith(accountMembership);
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
