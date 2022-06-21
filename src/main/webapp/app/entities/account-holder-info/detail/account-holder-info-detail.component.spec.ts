import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccountHolderInfoDetailComponent } from './account-holder-info-detail.component';

describe('AccountHolderInfo Management Detail Component', () => {
  let comp: AccountHolderInfoDetailComponent;
  let fixture: ComponentFixture<AccountHolderInfoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountHolderInfoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ accountHolderInfo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AccountHolderInfoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AccountHolderInfoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load accountHolderInfo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.accountHolderInfo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
