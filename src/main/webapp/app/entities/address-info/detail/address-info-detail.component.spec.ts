import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AddressInfoDetailComponent } from './address-info-detail.component';

describe('AddressInfo Management Detail Component', () => {
  let comp: AddressInfoDetailComponent;
  let fixture: ComponentFixture<AddressInfoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressInfoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ addressInfo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AddressInfoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AddressInfoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load addressInfo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.addressInfo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
