import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { IBANService } from '../service/iban.service';

import { IBANComponent } from './iban.component';

describe('IBAN Management Component', () => {
  let comp: IBANComponent;
  let fixture: ComponentFixture<IBANComponent>;
  let service: IBANService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IBANComponent],
    })
      .overrideTemplate(IBANComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IBANComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IBANService);

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
    expect(comp.iBANS?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
