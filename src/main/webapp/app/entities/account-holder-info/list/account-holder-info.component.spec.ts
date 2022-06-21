import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AccountHolderInfoService } from '../service/account-holder-info.service';

import { AccountHolderInfoComponent } from './account-holder-info.component';

describe('AccountHolderInfo Management Component', () => {
  let comp: AccountHolderInfoComponent;
  let fixture: ComponentFixture<AccountHolderInfoComponent>;
  let service: AccountHolderInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AccountHolderInfoComponent],
    })
      .overrideTemplate(AccountHolderInfoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountHolderInfoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AccountHolderInfoService);

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
    expect(comp.accountHolderInfos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
