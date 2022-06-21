import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StandingOrderDetailComponent } from './standing-order-detail.component';

describe('StandingOrder Management Detail Component', () => {
  let comp: StandingOrderDetailComponent;
  let fixture: ComponentFixture<StandingOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandingOrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ standingOrder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StandingOrderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StandingOrderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load standingOrder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.standingOrder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
