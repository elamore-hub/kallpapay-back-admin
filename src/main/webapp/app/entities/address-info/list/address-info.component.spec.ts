import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AddressInfoService } from '../service/address-info.service';

import { AddressInfoComponent } from './address-info.component';

describe('AddressInfo Management Component', () => {
  let comp: AddressInfoComponent;
  let fixture: ComponentFixture<AddressInfoComponent>;
  let service: AddressInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AddressInfoComponent],
    })
      .overrideTemplate(AddressInfoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AddressInfoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AddressInfoService);

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
    expect(comp.addressInfos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
