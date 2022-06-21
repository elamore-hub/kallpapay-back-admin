import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccountMembershipDetailComponent } from './account-membership-detail.component';

describe('AccountMembership Management Detail Component', () => {
  let comp: AccountMembershipDetailComponent;
  let fixture: ComponentFixture<AccountMembershipDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountMembershipDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ accountMembership: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AccountMembershipDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AccountMembershipDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load accountMembership on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.accountMembership).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
