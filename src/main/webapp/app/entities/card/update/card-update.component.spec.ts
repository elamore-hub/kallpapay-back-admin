import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CardService } from '../service/card.service';
import { ICard, Card } from '../card.model';
import { IAccountMembership } from 'app/entities/account-membership/account-membership.model';
import { AccountMembershipService } from 'app/entities/account-membership/service/account-membership.service';

import { CardUpdateComponent } from './card-update.component';

describe('Card Management Update Component', () => {
  let comp: CardUpdateComponent;
  let fixture: ComponentFixture<CardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cardService: CardService;
  let accountMembershipService: AccountMembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CardUpdateComponent],
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
      .overrideTemplate(CardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cardService = TestBed.inject(CardService);
    accountMembershipService = TestBed.inject(AccountMembershipService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AccountMembership query and add missing value', () => {
      const card: ICard = { id: 456 };
      const accountMembership: IAccountMembership = { id: 13332 };
      card.accountMembership = accountMembership;

      const accountMembershipCollection: IAccountMembership[] = [{ id: 98823 }];
      jest.spyOn(accountMembershipService, 'query').mockReturnValue(of(new HttpResponse({ body: accountMembershipCollection })));
      const additionalAccountMemberships = [accountMembership];
      const expectedCollection: IAccountMembership[] = [...additionalAccountMemberships, ...accountMembershipCollection];
      jest.spyOn(accountMembershipService, 'addAccountMembershipToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ card });
      comp.ngOnInit();

      expect(accountMembershipService.query).toHaveBeenCalled();
      expect(accountMembershipService.addAccountMembershipToCollectionIfMissing).toHaveBeenCalledWith(
        accountMembershipCollection,
        ...additionalAccountMemberships
      );
      expect(comp.accountMembershipsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const card: ICard = { id: 456 };
      const accountMembership: IAccountMembership = { id: 19451 };
      card.accountMembership = accountMembership;

      activatedRoute.data = of({ card });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(card));
      expect(comp.accountMembershipsSharedCollection).toContain(accountMembership);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Card>>();
      const card = { id: 123 };
      jest.spyOn(cardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ card });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: card }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(cardService.update).toHaveBeenCalledWith(card);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Card>>();
      const card = new Card();
      jest.spyOn(cardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ card });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: card }));
      saveSubject.complete();

      // THEN
      expect(cardService.create).toHaveBeenCalledWith(card);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Card>>();
      const card = { id: 123 };
      jest.spyOn(cardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ card });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cardService.update).toHaveBeenCalledWith(card);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAccountMembershipById', () => {
      it('Should return tracked AccountMembership primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccountMembershipById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
