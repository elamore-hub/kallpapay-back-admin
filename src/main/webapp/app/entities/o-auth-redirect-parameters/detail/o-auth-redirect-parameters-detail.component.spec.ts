import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OAuthRedirectParametersDetailComponent } from './o-auth-redirect-parameters-detail.component';

describe('OAuthRedirectParameters Management Detail Component', () => {
  let comp: OAuthRedirectParametersDetailComponent;
  let fixture: ComponentFixture<OAuthRedirectParametersDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OAuthRedirectParametersDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ oAuthRedirectParameters: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OAuthRedirectParametersDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OAuthRedirectParametersDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load oAuthRedirectParameters on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.oAuthRedirectParameters).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
