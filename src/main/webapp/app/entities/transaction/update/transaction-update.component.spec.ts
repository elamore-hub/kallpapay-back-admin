import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TransactionService } from '../service/transaction.service';
import { ITransaction, Transaction } from '../transaction.model';
import { IAmount } from 'app/entities/amount/amount.model';
import { AmountService } from 'app/entities/amount/service/amount.service';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';
import { IIBAN } from 'app/entities/iban/iban.model';
import { IBANService } from 'app/entities/iban/service/iban.service';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/service/payment.service';

import { TransactionUpdateComponent } from './transaction-update.component';

describe('Transaction Management Update Component', () => {
  let comp: TransactionUpdateComponent;
  let fixture: ComponentFixture<TransactionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let transactionService: TransactionService;
  let amountService: AmountService;
  let bankAccountService: BankAccountService;
  let iBANService: IBANService;
  let paymentService: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TransactionUpdateComponent],
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
      .overrideTemplate(TransactionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TransactionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    transactionService = TestBed.inject(TransactionService);
    amountService = TestBed.inject(AmountService);
    bankAccountService = TestBed.inject(BankAccountService);
    iBANService = TestBed.inject(IBANService);
    paymentService = TestBed.inject(PaymentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call amount query and add missing value', () => {
      const transaction: ITransaction = { id: 456 };
      const amount: IAmount = { id: 34283 };
      transaction.amount = amount;

      const amountCollection: IAmount[] = [{ id: 76939 }];
      jest.spyOn(amountService, 'query').mockReturnValue(of(new HttpResponse({ body: amountCollection })));
      const expectedCollection: IAmount[] = [amount, ...amountCollection];
      jest.spyOn(amountService, 'addAmountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(amountService.query).toHaveBeenCalled();
      expect(amountService.addAmountToCollectionIfMissing).toHaveBeenCalledWith(amountCollection, amount);
      expect(comp.amountsCollection).toEqual(expectedCollection);
    });

    it('Should call BankAccount query and add missing value', () => {
      const transaction: ITransaction = { id: 456 };
      const bankAccount: IBankAccount = { id: 6863 };
      transaction.bankAccount = bankAccount;

      const bankAccountCollection: IBankAccount[] = [{ id: 67305 }];
      jest.spyOn(bankAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: bankAccountCollection })));
      const additionalBankAccounts = [bankAccount];
      const expectedCollection: IBankAccount[] = [...additionalBankAccounts, ...bankAccountCollection];
      jest.spyOn(bankAccountService, 'addBankAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(bankAccountService.query).toHaveBeenCalled();
      expect(bankAccountService.addBankAccountToCollectionIfMissing).toHaveBeenCalledWith(bankAccountCollection, ...additionalBankAccounts);
      expect(comp.bankAccountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call IBAN query and add missing value', () => {
      const transaction: ITransaction = { id: 456 };
      const iBAN: IIBAN = { id: 92336 };
      transaction.iBAN = iBAN;

      const iBANCollection: IIBAN[] = [{ id: 22296 }];
      jest.spyOn(iBANService, 'query').mockReturnValue(of(new HttpResponse({ body: iBANCollection })));
      const additionalIBANS = [iBAN];
      const expectedCollection: IIBAN[] = [...additionalIBANS, ...iBANCollection];
      jest.spyOn(iBANService, 'addIBANToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(iBANService.query).toHaveBeenCalled();
      expect(iBANService.addIBANToCollectionIfMissing).toHaveBeenCalledWith(iBANCollection, ...additionalIBANS);
      expect(comp.iBANSSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Payment query and add missing value', () => {
      const transaction: ITransaction = { id: 456 };
      const payment: IPayment = { id: 40348 };
      transaction.payment = payment;

      const paymentCollection: IPayment[] = [{ id: 35175 }];
      jest.spyOn(paymentService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentCollection })));
      const additionalPayments = [payment];
      const expectedCollection: IPayment[] = [...additionalPayments, ...paymentCollection];
      jest.spyOn(paymentService, 'addPaymentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(paymentService.query).toHaveBeenCalled();
      expect(paymentService.addPaymentToCollectionIfMissing).toHaveBeenCalledWith(paymentCollection, ...additionalPayments);
      expect(comp.paymentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const transaction: ITransaction = { id: 456 };
      const amount: IAmount = { id: 51104 };
      transaction.amount = amount;
      const bankAccount: IBankAccount = { id: 2629 };
      transaction.bankAccount = bankAccount;
      const iBAN: IIBAN = { id: 70501 };
      transaction.iBAN = iBAN;
      const payment: IPayment = { id: 94837 };
      transaction.payment = payment;

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(transaction));
      expect(comp.amountsCollection).toContain(amount);
      expect(comp.bankAccountsSharedCollection).toContain(bankAccount);
      expect(comp.iBANSSharedCollection).toContain(iBAN);
      expect(comp.paymentsSharedCollection).toContain(payment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Transaction>>();
      const transaction = { id: 123 };
      jest.spyOn(transactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transaction }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(transactionService.update).toHaveBeenCalledWith(transaction);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Transaction>>();
      const transaction = new Transaction();
      jest.spyOn(transactionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transaction }));
      saveSubject.complete();

      // THEN
      expect(transactionService.create).toHaveBeenCalledWith(transaction);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Transaction>>();
      const transaction = { id: 123 };
      jest.spyOn(transactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(transactionService.update).toHaveBeenCalledWith(transaction);
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

    describe('trackBankAccountById', () => {
      it('Should return tracked BankAccount primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBankAccountById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackIBANById', () => {
      it('Should return tracked IBAN primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackIBANById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPaymentById', () => {
      it('Should return tracked Payment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPaymentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
