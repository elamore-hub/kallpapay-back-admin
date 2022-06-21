import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SEPABeneficiaryService } from '../service/sepa-beneficiary.service';
import { ISEPABeneficiary, SEPABeneficiary } from '../sepa-beneficiary.model';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

import { SEPABeneficiaryUpdateComponent } from './sepa-beneficiary-update.component';

describe('SEPABeneficiary Management Update Component', () => {
  let comp: SEPABeneficiaryUpdateComponent;
  let fixture: ComponentFixture<SEPABeneficiaryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sEPABeneficiaryService: SEPABeneficiaryService;
  let addressService: AddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SEPABeneficiaryUpdateComponent],
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
      .overrideTemplate(SEPABeneficiaryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SEPABeneficiaryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sEPABeneficiaryService = TestBed.inject(SEPABeneficiaryService);
    addressService = TestBed.inject(AddressService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call address query and add missing value', () => {
      const sEPABeneficiary: ISEPABeneficiary = { id: 456 };
      const address: IAddress = { id: 42847 };
      sEPABeneficiary.address = address;

      const addressCollection: IAddress[] = [{ id: 78201 }];
      jest.spyOn(addressService, 'query').mockReturnValue(of(new HttpResponse({ body: addressCollection })));
      const expectedCollection: IAddress[] = [address, ...addressCollection];
      jest.spyOn(addressService, 'addAddressToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sEPABeneficiary });
      comp.ngOnInit();

      expect(addressService.query).toHaveBeenCalled();
      expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, address);
      expect(comp.addressesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sEPABeneficiary: ISEPABeneficiary = { id: 456 };
      const address: IAddress = { id: 64028 };
      sEPABeneficiary.address = address;

      activatedRoute.data = of({ sEPABeneficiary });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sEPABeneficiary));
      expect(comp.addressesCollection).toContain(address);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SEPABeneficiary>>();
      const sEPABeneficiary = { id: 123 };
      jest.spyOn(sEPABeneficiaryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sEPABeneficiary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sEPABeneficiary }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sEPABeneficiaryService.update).toHaveBeenCalledWith(sEPABeneficiary);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SEPABeneficiary>>();
      const sEPABeneficiary = new SEPABeneficiary();
      jest.spyOn(sEPABeneficiaryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sEPABeneficiary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sEPABeneficiary }));
      saveSubject.complete();

      // THEN
      expect(sEPABeneficiaryService.create).toHaveBeenCalledWith(sEPABeneficiary);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SEPABeneficiary>>();
      const sEPABeneficiary = { id: 123 };
      jest.spyOn(sEPABeneficiaryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sEPABeneficiary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sEPABeneficiaryService.update).toHaveBeenCalledWith(sEPABeneficiary);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAddressById', () => {
      it('Should return tracked Address primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAddressById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
