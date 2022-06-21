import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MyCauseDetailComponent } from './my-cause-detail.component';

describe('MyCause Management Detail Component', () => {
  let comp: MyCauseDetailComponent;
  let fixture: ComponentFixture<MyCauseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCauseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ myCause: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MyCauseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MyCauseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load myCause on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.myCause).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
