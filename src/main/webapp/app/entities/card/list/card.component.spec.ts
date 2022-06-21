import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CardService } from '../service/card.service';

import { CardComponent } from './card.component';

describe('Card Management Component', () => {
  let comp: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let service: CardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CardComponent],
    })
      .overrideTemplate(CardComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CardService);

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
    expect(comp.cards?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
