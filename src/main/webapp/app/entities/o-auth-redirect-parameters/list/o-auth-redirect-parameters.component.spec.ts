import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OAuthRedirectParametersService } from '../service/o-auth-redirect-parameters.service';

import { OAuthRedirectParametersComponent } from './o-auth-redirect-parameters.component';

describe('OAuthRedirectParameters Management Component', () => {
  let comp: OAuthRedirectParametersComponent;
  let fixture: ComponentFixture<OAuthRedirectParametersComponent>;
  let service: OAuthRedirectParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OAuthRedirectParametersComponent],
    })
      .overrideTemplate(OAuthRedirectParametersComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OAuthRedirectParametersComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OAuthRedirectParametersService);

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
    expect(comp.oAuthRedirectParameters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
