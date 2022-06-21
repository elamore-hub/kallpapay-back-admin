import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AccountHolderInfoService } from '../service/account-holder-info.service';
import { IAccountHolderInfo, AccountHolderInfo } from '../account-holder-info.model';

import { AccountHolderInfoUpdateComponent } from './account-holder-info-update.component';

describe('AccountHolderInfo Management Update Component', () => {
  let comp: AccountHolderInfoUpdateComponent;
  let fixture: ComponentFixture<AccountHolderInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let accountHolderInfoService: AccountHolderInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AccountHolderInfoUpdateComponent],
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
      .overrideTemplate(AccountHolderInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountHolderInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accountHolderInfoService = TestBed.inject(AccountHolderInfoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const accountHolderInfo: IAccountHolderInfo = { id: 456 };

      activatedRoute.data = of({ accountHolderInfo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(accountHolderInfo));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountHolderInfo>>();
      const accountHolderInfo = { id: 123 };
      jest.spyOn(accountHolderInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountHolderInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountHolderInfo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(accountHolderInfoService.update).toHaveBeenCalledWith(accountHolderInfo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountHolderInfo>>();
      const accountHolderInfo = new AccountHolderInfo();
      jest.spyOn(accountHolderInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountHolderInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountHolderInfo }));
      saveSubject.complete();

      // THEN
      expect(accountHolderInfoService.create).toHaveBeenCalledWith(accountHolderInfo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountHolderInfo>>();
      const accountHolderInfo = { id: 123 };
      jest.spyOn(accountHolderInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountHolderInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accountHolderInfoService.update).toHaveBeenCalledWith(accountHolderInfo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
