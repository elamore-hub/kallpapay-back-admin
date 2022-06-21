import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PortfolioDetailComponent } from './portfolio-detail.component';

describe('Portfolio Management Detail Component', () => {
  let comp: PortfolioDetailComponent;
  let fixture: ComponentFixture<PortfolioDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ portfolio: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PortfolioDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PortfolioDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load portfolio on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.portfolio).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
