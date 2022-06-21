import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AccountHolderService } from '../service/account-holder.service';

import { AccountHolderComponent } from './account-holder.component';

describe('AccountHolder Management Component', () => {
  let comp: AccountHolderComponent;
  let fixture: ComponentFixture<AccountHolderComponent>;
  let service: AccountHolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AccountHolderComponent],
    })
      .overrideTemplate(AccountHolderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountHolderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AccountHolderService);

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
    expect(comp.accountHolders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
