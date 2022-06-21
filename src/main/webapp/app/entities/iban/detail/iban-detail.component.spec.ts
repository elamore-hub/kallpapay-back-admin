import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IBANDetailComponent } from './iban-detail.component';

describe('IBAN Management Detail Component', () => {
  let comp: IBANDetailComponent;
  let fixture: ComponentFixture<IBANDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IBANDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ iBAN: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IBANDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IBANDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load iBAN on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.iBAN).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
