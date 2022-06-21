import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OnboardingService } from '../service/onboarding.service';
import { IOnboarding, Onboarding } from '../onboarding.model';
import { IAccountHolder } from 'app/entities/account-holder/account-holder.model';
import { AccountHolderService } from 'app/entities/account-holder/service/account-holder.service';
import { IOAuthRedirectParameters } from 'app/entities/o-auth-redirect-parameters/o-auth-redirect-parameters.model';
import { OAuthRedirectParametersService } from 'app/entities/o-auth-redirect-parameters/service/o-auth-redirect-parameters.service';

import { OnboardingUpdateComponent } from './onboarding-update.component';

describe('Onboarding Management Update Component', () => {
  let comp: OnboardingUpdateComponent;
  let fixture: ComponentFixture<OnboardingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let onboardingService: OnboardingService;
  let accountHolderService: AccountHolderService;
  let oAuthRedirectParametersService: OAuthRedirectParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OnboardingUpdateComponent],
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
      .overrideTemplate(OnboardingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OnboardingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    onboardingService = TestBed.inject(OnboardingService);
    accountHolderService = TestBed.inject(AccountHolderService);
    oAuthRedirectParametersService = TestBed.inject(OAuthRedirectParametersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call accountHolder query and add missing value', () => {
      const onboarding: IOnboarding = { id: 456 };
      const accountHolder: IAccountHolder = { id: 6641 };
      onboarding.accountHolder = accountHolder;

      const accountHolderCollection: IAccountHolder[] = [{ id: 47312 }];
      jest.spyOn(accountHolderService, 'query').mockReturnValue(of(new HttpResponse({ body: accountHolderCollection })));
      const expectedCollection: IAccountHolder[] = [accountHolder, ...accountHolderCollection];
      jest.spyOn(accountHolderService, 'addAccountHolderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ onboarding });
      comp.ngOnInit();

      expect(accountHolderService.query).toHaveBeenCalled();
      expect(accountHolderService.addAccountHolderToCollectionIfMissing).toHaveBeenCalledWith(accountHolderCollection, accountHolder);
      expect(comp.accountHoldersCollection).toEqual(expectedCollection);
    });

    it('Should call oAuthRedirectParameters query and add missing value', () => {
      const onboarding: IOnboarding = { id: 456 };
      const oAuthRedirectParameters: IOAuthRedirectParameters = { id: 29995 };
      onboarding.oAuthRedirectParameters = oAuthRedirectParameters;

      const oAuthRedirectParametersCollection: IOAuthRedirectParameters[] = [{ id: 37307 }];
      jest
        .spyOn(oAuthRedirectParametersService, 'query')
        .mockReturnValue(of(new HttpResponse({ body: oAuthRedirectParametersCollection })));
      const expectedCollection: IOAuthRedirectParameters[] = [oAuthRedirectParameters, ...oAuthRedirectParametersCollection];
      jest.spyOn(oAuthRedirectParametersService, 'addOAuthRedirectParametersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ onboarding });
      comp.ngOnInit();

      expect(oAuthRedirectParametersService.query).toHaveBeenCalled();
      expect(oAuthRedirectParametersService.addOAuthRedirectParametersToCollectionIfMissing).toHaveBeenCalledWith(
        oAuthRedirectParametersCollection,
        oAuthRedirectParameters
      );
      expect(comp.oAuthRedirectParametersCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const onboarding: IOnboarding = { id: 456 };
      const accountHolder: IAccountHolder = { id: 20774 };
      onboarding.accountHolder = accountHolder;
      const oAuthRedirectParameters: IOAuthRedirectParameters = { id: 58799 };
      onboarding.oAuthRedirectParameters = oAuthRedirectParameters;

      activatedRoute.data = of({ onboarding });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(onboarding));
      expect(comp.accountHoldersCollection).toContain(accountHolder);
      expect(comp.oAuthRedirectParametersCollection).toContain(oAuthRedirectParameters);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Onboarding>>();
      const onboarding = { id: 123 };
      jest.spyOn(onboardingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ onboarding });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: onboarding }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(onboardingService.update).toHaveBeenCalledWith(onboarding);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Onboarding>>();
      const onboarding = new Onboarding();
      jest.spyOn(onboardingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ onboarding });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: onboarding }));
      saveSubject.complete();

      // THEN
      expect(onboardingService.create).toHaveBeenCalledWith(onboarding);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Onboarding>>();
      const onboarding = { id: 123 };
      jest.spyOn(onboardingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ onboarding });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(onboardingService.update).toHaveBeenCalledWith(onboarding);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAccountHolderById', () => {
      it('Should return tracked AccountHolder primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccountHolderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackOAuthRedirectParametersById', () => {
      it('Should return tracked OAuthRedirectParameters primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOAuthRedirectParametersById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
