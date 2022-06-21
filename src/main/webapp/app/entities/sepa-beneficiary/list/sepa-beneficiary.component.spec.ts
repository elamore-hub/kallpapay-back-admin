import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SEPABeneficiaryService } from '../service/sepa-beneficiary.service';

import { SEPABeneficiaryComponent } from './sepa-beneficiary.component';

describe('SEPABeneficiary Management Component', () => {
  let comp: SEPABeneficiaryComponent;
  let fixture: ComponentFixture<SEPABeneficiaryComponent>;
  let service: SEPABeneficiaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SEPABeneficiaryComponent],
    })
      .overrideTemplate(SEPABeneficiaryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SEPABeneficiaryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SEPABeneficiaryService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.sEPABeneficiaries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
