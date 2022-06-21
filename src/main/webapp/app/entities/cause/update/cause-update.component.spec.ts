import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CauseService } from '../service/cause.service';
import { ICause, Cause } from '../cause.model';

import { CauseUpdateComponent } from './cause-update.component';

describe('Cause Management Update Component', () => {
  let comp: CauseUpdateComponent;
  let fixture: ComponentFixture<CauseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let causeService: CauseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CauseUpdateComponent],
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
      .overrideTemplate(CauseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CauseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    causeService = TestBed.inject(CauseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const cause: ICause = { id: 456 };

      activatedRoute.data = of({ cause });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(cause));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cause>>();
      const cause = { id: 123 };
      jest.spyOn(causeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cause });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cause }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(causeService.update).toHaveBeenCalledWith(cause);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cause>>();
      const cause = new Cause();
      jest.spyOn(causeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cause });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cause }));
      saveSubject.complete();

      // THEN
      expect(causeService.create).toHaveBeenCalledWith(cause);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cause>>();
      const cause = { id: 123 };
      jest.spyOn(causeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cause });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(causeService.update).toHaveBeenCalledWith(cause);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
