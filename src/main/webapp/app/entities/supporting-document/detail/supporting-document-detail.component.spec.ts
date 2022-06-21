import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SupportingDocumentDetailComponent } from './supporting-document-detail.component';

describe('SupportingDocument Management Detail Component', () => {
  let comp: SupportingDocumentDetailComponent;
  let fixture: ComponentFixture<SupportingDocumentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupportingDocumentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ supportingDocument: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SupportingDocumentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SupportingDocumentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load supportingDocument on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.supportingDocument).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
