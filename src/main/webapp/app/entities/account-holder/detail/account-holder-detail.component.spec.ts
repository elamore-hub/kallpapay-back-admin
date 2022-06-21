import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccountHolderDetailComponent } from './account-holder-detail.component';

describe('AccountHolder Management Detail Component', () => {
  let comp: AccountHolderDetailComponent;
  let fixture: ComponentFixture<AccountHolderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountHolderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ accountHolder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AccountHolderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AccountHolderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load accountHolder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.accountHolder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
