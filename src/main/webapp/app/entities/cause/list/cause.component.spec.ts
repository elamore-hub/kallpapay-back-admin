import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CauseService } from '../service/cause.service';

import { CauseComponent } from './cause.component';

describe('Cause Management Component', () => {
  let comp: CauseComponent;
  let fixture: ComponentFixture<CauseComponent>;
  let service: CauseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CauseComponent],
    })
      .overrideTemplate(CauseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CauseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CauseService);

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
    expect(comp.causes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
