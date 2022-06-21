import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AccountBalancesService } from '../service/account-balances.service';

import { AccountBalancesComponent } from './account-balances.component';

describe('AccountBalances Management Component', () => {
  let comp: AccountBalancesComponent;
  let fixture: ComponentFixture<AccountBalancesComponent>;
  let service: AccountBalancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AccountBalancesComponent],
    })
      .overrideTemplate(AccountBalancesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountBalancesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AccountBalancesService);

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
    expect(comp.accountBalances?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
