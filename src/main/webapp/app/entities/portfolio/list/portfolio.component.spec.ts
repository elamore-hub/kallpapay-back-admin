import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PortfolioService } from '../service/portfolio.service';

import { PortfolioComponent } from './portfolio.component';

describe('Portfolio Management Component', () => {
  let comp: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
  let service: PortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PortfolioComponent],
    })
      .overrideTemplate(PortfolioComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PortfolioService);

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
    expect(comp.portfolios?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
