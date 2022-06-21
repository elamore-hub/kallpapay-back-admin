import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AccountMembershipService } from '../service/account-membership.service';

import { AccountMembershipComponent } from './account-membership.component';

describe('AccountMembership Management Component', () => {
  let comp: AccountMembershipComponent;
  let fixture: ComponentFixture<AccountMembershipComponent>;
  let service: AccountMembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AccountMembershipComponent],
    })
      .overrideTemplate(AccountMembershipComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountMembershipComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AccountMembershipService);

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
    expect(comp.accountMemberships?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
