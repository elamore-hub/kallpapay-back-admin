import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AccountHolderService } from '../service/account-holder.service';
import { IAccountHolder, AccountHolder } from '../account-holder.model';
import { IAccountHolderInfo } from 'app/entities/account-holder-info/account-holder-info.model';
import { AccountHolderInfoService } from 'app/entities/account-holder-info/service/account-holder-info.service';
import { IAddressInfo } from 'app/entities/address-info/address-info.model';
import { AddressInfoService } from 'app/entities/address-info/service/address-info.service';

import { AccountHolderUpdateComponent } from './account-holder-update.component';

describe('AccountHolder Management Update Component', () => {
  let comp: AccountHolderUpdateComponent;
  let fixture: ComponentFixture<AccountHolderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let accountHolderService: AccountHolderService;
  let accountHolderInfoService: AccountHolderInfoService;
  let addressInfoService: AddressInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AccountHolderUpdateComponent],
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
      .overrideTemplate(AccountHolderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountHolderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accountHolderService = TestBed.inject(AccountHolderService);
    accountHolderInfoService = TestBed.inject(AccountHolderInfoService);
    addressInfoService = TestBed.inject(AddressInfoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call accountHolderInfo query and add missing value', () => {
      const accountHolder: IAccountHolder = { id: 456 };
      const accountHolderInfo: IAccountHolderInfo = { id: 5416 };
      accountHolder.accountHolderInfo = accountHolderInfo;

      const accountHolderInfoCollection: IAccountHolderInfo[] = [{ id: 72700 }];
      jest.spyOn(accountHolderInfoService, 'query').mockReturnValue(of(new HttpResponse({ body: accountHolderInfoCollection })));
      const expectedCollection: IAccountHolderInfo[] = [accountHolderInfo, ...accountHolderInfoCollection];
      jest.spyOn(accountHolderInfoService, 'addAccountHolderInfoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountHolder });
      comp.ngOnInit();

      expect(accountHolderInfoService.query).toHaveBeenCalled();
      expect(accountHolderInfoService.addAccountHolderInfoToCollectionIfMissing).toHaveBeenCalledWith(
        accountHolderInfoCollection,
        accountHolderInfo
      );
      expect(comp.accountHolderInfosCollection).toEqual(expectedCollection);
    });

    it('Should call residencyAddress query and add missing value', () => {
      const accountHolder: IAccountHolder = { id: 456 };
      const residencyAddress: IAddressInfo = { id: 88585 };
      accountHolder.residencyAddress = residencyAddress;

      const residencyAddressCollection: IAddressInfo[] = [{ id: 90064 }];
      jest.spyOn(addressInfoService, 'query').mockReturnValue(of(new HttpResponse({ body: residencyAddressCollection })));
      const expectedCollection: IAddressInfo[] = [residencyAddress, ...residencyAddressCollection];
      jest.spyOn(addressInfoService, 'addAddressInfoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountHolder });
      comp.ngOnInit();

      expect(addressInfoService.query).toHaveBeenCalled();
      expect(addressInfoService.addAddressInfoToCollectionIfMissing).toHaveBeenCalledWith(residencyAddressCollection, residencyAddress);
      expect(comp.residencyAddressesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const accountHolder: IAccountHolder = { id: 456 };
      const accountHolderInfo: IAccountHolderInfo = { id: 36189 };
      accountHolder.accountHolderInfo = accountHolderInfo;
      const residencyAddress: IAddressInfo = { id: 33402 };
      accountHolder.residencyAddress = residencyAddress;

      activatedRoute.data = of({ accountHolder });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(accountHolder));
      expect(comp.accountHolderInfosCollection).toContain(accountHolderInfo);
      expect(comp.residencyAddressesCollection).toContain(residencyAddress);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountHolder>>();
      const accountHolder = { id: 123 };
      jest.spyOn(accountHolderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountHolder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountHolder }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(accountHolderService.update).toHaveBeenCalledWith(accountHolder);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountHolder>>();
      const accountHolder = new AccountHolder();
      jest.spyOn(accountHolderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountHolder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountHolder }));
      saveSubject.complete();

      // THEN
      expect(accountHolderService.create).toHaveBeenCalledWith(accountHolder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountHolder>>();
      const accountHolder = { id: 123 };
      jest.spyOn(accountHolderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountHolder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accountHolderService.update).toHaveBeenCalledWith(accountHolder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAccountHolderInfoById', () => {
      it('Should return tracked AccountHolderInfo primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccountHolderInfoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAddressInfoById', () => {
      it('Should return tracked AddressInfo primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAddressInfoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
