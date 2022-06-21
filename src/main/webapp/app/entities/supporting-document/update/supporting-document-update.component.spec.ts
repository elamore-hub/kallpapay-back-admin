import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SupportingDocumentService } from '../service/supporting-document.service';
import { ISupportingDocument, SupportingDocument } from '../supporting-document.model';
import { IAccountHolder } from 'app/entities/account-holder/account-holder.model';
import { AccountHolderService } from 'app/entities/account-holder/service/account-holder.service';
import { IOnboarding } from 'app/entities/onboarding/onboarding.model';
import { OnboardingService } from 'app/entities/onboarding/service/onboarding.service';

import { SupportingDocumentUpdateComponent } from './supporting-document-update.component';

describe('SupportingDocument Management Update Component', () => {
  let comp: SupportingDocumentUpdateComponent;
  let fixture: ComponentFixture<SupportingDocumentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let supportingDocumentService: SupportingDocumentService;
  let accountHolderService: AccountHolderService;
  let onboardingService: OnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SupportingDocumentUpdateComponent],
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
      .overrideTemplate(SupportingDocumentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SupportingDocumentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    supportingDocumentService = TestBed.inject(SupportingDocumentService);
    accountHolderService = TestBed.inject(AccountHolderService);
    onboardingService = TestBed.inject(OnboardingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AccountHolder query and add missing value', () => {
      const supportingDocument: ISupportingDocument = { id: 456 };
      const accountHolder: IAccountHolder = { id: 53352 };
      supportingDocument.accountHolder = accountHolder;

      const accountHolderCollection: IAccountHolder[] = [{ id: 36663 }];
      jest.spyOn(accountHolderService, 'query').mockReturnValue(of(new HttpResponse({ body: accountHolderCollection })));
      const additionalAccountHolders = [accountHolder];
      const expectedCollection: IAccountHolder[] = [...additionalAccountHolders, ...accountHolderCollection];
      jest.spyOn(accountHolderService, 'addAccountHolderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ supportingDocument });
      comp.ngOnInit();

      expect(accountHolderService.query).toHaveBeenCalled();
      expect(accountHolderService.addAccountHolderToCollectionIfMissing).toHaveBeenCalledWith(
        accountHolderCollection,
        ...additionalAccountHolders
      );
      expect(comp.accountHoldersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Onboarding query and add missing value', () => {
      const supportingDocument: ISupportingDocument = { id: 456 };
      const onboarding: IOnboarding = { id: 10441 };
      supportingDocument.onboarding = onboarding;

      const onboardingCollection: IOnboarding[] = [{ id: 16268 }];
      jest.spyOn(onboardingService, 'query').mockReturnValue(of(new HttpResponse({ body: onboardingCollection })));
      const additionalOnboardings = [onboarding];
      const expectedCollection: IOnboarding[] = [...additionalOnboardings, ...onboardingCollection];
      jest.spyOn(onboardingService, 'addOnboardingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ supportingDocument });
      comp.ngOnInit();

      expect(onboardingService.query).toHaveBeenCalled();
      expect(onboardingService.addOnboardingToCollectionIfMissing).toHaveBeenCalledWith(onboardingCollection, ...additionalOnboardings);
      expect(comp.onboardingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const supportingDocument: ISupportingDocument = { id: 456 };
      const accountHolder: IAccountHolder = { id: 89290 };
      supportingDocument.accountHolder = accountHolder;
      const onboarding: IOnboarding = { id: 52412 };
      supportingDocument.onboarding = onboarding;

      activatedRoute.data = of({ supportingDocument });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(supportingDocument));
      expect(comp.accountHoldersSharedCollection).toContain(accountHolder);
      expect(comp.onboardingsSharedCollection).toContain(onboarding);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SupportingDocument>>();
      const supportingDocument = { id: 123 };
      jest.spyOn(supportingDocumentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supportingDocument });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: supportingDocument }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(supportingDocumentService.update).toHaveBeenCalledWith(supportingDocument);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SupportingDocument>>();
      const supportingDocument = new SupportingDocument();
      jest.spyOn(supportingDocumentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supportingDocument });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: supportingDocument }));
      saveSubject.complete();

      // THEN
      expect(supportingDocumentService.create).toHaveBeenCalledWith(supportingDocument);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SupportingDocument>>();
      const supportingDocument = { id: 123 };
      jest.spyOn(supportingDocumentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supportingDocument });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(supportingDocumentService.update).toHaveBeenCalledWith(supportingDocument);
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

    describe('trackOnboardingById', () => {
      it('Should return tracked Onboarding primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOnboardingById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
