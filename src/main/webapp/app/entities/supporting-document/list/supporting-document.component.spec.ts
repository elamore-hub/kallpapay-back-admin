import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SupportingDocumentService } from '../service/supporting-document.service';

import { SupportingDocumentComponent } from './supporting-document.component';

describe('SupportingDocument Management Component', () => {
  let comp: SupportingDocumentComponent;
  let fixture: ComponentFixture<SupportingDocumentComponent>;
  let service: SupportingDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SupportingDocumentComponent],
    })
      .overrideTemplate(SupportingDocumentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SupportingDocumentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SupportingDocumentService);

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
    expect(comp.supportingDocuments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
