import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAccountBalances, AccountBalances } from '../account-balances.model';
import { AccountBalancesService } from '../service/account-balances.service';

import { AccountBalancesRoutingResolveService } from './account-balances-routing-resolve.service';

describe('AccountBalances routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AccountBalancesRoutingResolveService;
  let service: AccountBalancesService;
  let resultAccountBalances: IAccountBalances | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(AccountBalancesRoutingResolveService);
    service = TestBed.inject(AccountBalancesService);
    resultAccountBalances = undefined;
  });

  describe('resolve', () => {
    it('should return IAccountBalances returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountBalances = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAccountBalances).toEqual({ id: 123 });
    });

    it('should return new IAccountBalances if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountBalances = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAccountBalances).toEqual(new AccountBalances());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AccountBalances })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountBalances = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAccountBalances).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
