import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StandingOrderService } from '../service/standing-order.service';

import { StandingOrderComponent } from './standing-order.component';

describe('StandingOrder Management Component', () => {
  let comp: StandingOrderComponent;
  let fixture: ComponentFixture<StandingOrderComponent>;
  let service: StandingOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StandingOrderComponent],
    })
      .overrideTemplate(StandingOrderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StandingOrderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StandingOrderService);

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
    expect(comp.standingOrders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
