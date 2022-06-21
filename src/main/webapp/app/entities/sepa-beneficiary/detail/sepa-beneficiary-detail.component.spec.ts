import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SEPABeneficiaryDetailComponent } from './sepa-beneficiary-detail.component';

describe('SEPABeneficiary Management Detail Component', () => {
  let comp: SEPABeneficiaryDetailComponent;
  let fixture: ComponentFixture<SEPABeneficiaryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SEPABeneficiaryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sEPABeneficiary: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SEPABeneficiaryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SEPABeneficiaryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sEPABeneficiary on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sEPABeneficiary).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
