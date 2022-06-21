import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParticipationDetailComponent } from './participation-detail.component';

describe('Participation Management Detail Component', () => {
  let comp: ParticipationDetailComponent;
  let fixture: ComponentFixture<ParticipationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ participation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParticipationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParticipationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load participation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.participation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
