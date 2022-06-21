import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OAuthRedirectParametersService } from '../service/o-auth-redirect-parameters.service';
import { IOAuthRedirectParameters, OAuthRedirectParameters } from '../o-auth-redirect-parameters.model';

import { OAuthRedirectParametersUpdateComponent } from './o-auth-redirect-parameters-update.component';

describe('OAuthRedirectParameters Management Update Component', () => {
  let comp: OAuthRedirectParametersUpdateComponent;
  let fixture: ComponentFixture<OAuthRedirectParametersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let oAuthRedirectParametersService: OAuthRedirectParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OAuthRedirectParametersUpdateComponent],
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
      .overrideTemplate(OAuthRedirectParametersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OAuthRedirectParametersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    oAuthRedirectParametersService = TestBed.inject(OAuthRedirectParametersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const oAuthRedirectParameters: IOAuthRedirectParameters = { id: 456 };

      activatedRoute.data = of({ oAuthRedirectParameters });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(oAuthRedirectParameters));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OAuthRedirectParameters>>();
      const oAuthRedirectParameters = { id: 123 };
      jest.spyOn(oAuthRedirectParametersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ oAuthRedirectParameters });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: oAuthRedirectParameters }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(oAuthRedirectParametersService.update).toHaveBeenCalledWith(oAuthRedirectParameters);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OAuthRedirectParameters>>();
      const oAuthRedirectParameters = new OAuthRedirectParameters();
      jest.spyOn(oAuthRedirectParametersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ oAuthRedirectParameters });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: oAuthRedirectParameters }));
      saveSubject.complete();

      // THEN
      expect(oAuthRedirectParametersService.create).toHaveBeenCalledWith(oAuthRedirectParameters);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OAuthRedirectParameters>>();
      const oAuthRedirectParameters = { id: 123 };
      jest.spyOn(oAuthRedirectParametersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ oAuthRedirectParameters });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(oAuthRedirectParametersService.update).toHaveBeenCalledWith(oAuthRedirectParameters);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
