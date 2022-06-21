import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OnboardingDetailComponent } from './onboarding-detail.component';

describe('Onboarding Management Detail Component', () => {
  let comp: OnboardingDetailComponent;
  let fixture: ComponentFixture<OnboardingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ onboarding: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OnboardingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OnboardingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load onboarding on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.onboarding).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
