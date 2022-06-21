import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccountBalancesDetailComponent } from './account-balances-detail.component';

describe('AccountBalances Management Detail Component', () => {
  let comp: AccountBalancesDetailComponent;
  let fixture: ComponentFixture<AccountBalancesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountBalancesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ accountBalances: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AccountBalancesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AccountBalancesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load accountBalances on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.accountBalances).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
