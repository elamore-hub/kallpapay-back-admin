import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OnboardingService } from '../service/onboarding.service';

import { OnboardingComponent } from './onboarding.component';

describe('Onboarding Management Component', () => {
  let comp: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;
  let service: OnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OnboardingComponent],
    })
      .overrideTemplate(OnboardingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OnboardingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OnboardingService);

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
    expect(comp.onboardings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
