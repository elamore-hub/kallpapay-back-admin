import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MyCauseService } from '../service/my-cause.service';

import { MyCauseComponent } from './my-cause.component';

describe('MyCause Management Component', () => {
  let comp: MyCauseComponent;
  let fixture: ComponentFixture<MyCauseComponent>;
  let service: MyCauseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MyCauseComponent],
    })
      .overrideTemplate(MyCauseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MyCauseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MyCauseService);

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
    expect(comp.myCauses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
