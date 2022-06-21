import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AddressInfoService } from '../service/address-info.service';
import { IAddressInfo, AddressInfo } from '../address-info.model';

import { AddressInfoUpdateComponent } from './address-info-update.component';

describe('AddressInfo Management Update Component', () => {
  let comp: AddressInfoUpdateComponent;
  let fixture: ComponentFixture<AddressInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let addressInfoService: AddressInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AddressInfoUpdateComponent],
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
      .overrideTemplate(AddressInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AddressInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    addressInfoService = TestBed.inject(AddressInfoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const addressInfo: IAddressInfo = { id: 456 };

      activatedRoute.data = of({ addressInfo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(addressInfo));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AddressInfo>>();
      const addressInfo = { id: 123 };
      jest.spyOn(addressInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ addressInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: addressInfo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(addressInfoService.update).toHaveBeenCalledWith(addressInfo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AddressInfo>>();
      const addressInfo = new AddressInfo();
      jest.spyOn(addressInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ addressInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: addressInfo }));
      saveSubject.complete();

      // THEN
      expect(addressInfoService.create).toHaveBeenCalledWith(addressInfo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AddressInfo>>();
      const addressInfo = { id: 123 };
      jest.spyOn(addressInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ addressInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(addressInfoService.update).toHaveBeenCalledWith(addressInfo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
