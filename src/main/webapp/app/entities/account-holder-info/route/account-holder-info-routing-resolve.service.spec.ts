import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAccountHolderInfo, AccountHolderInfo } from '../account-holder-info.model';
import { AccountHolderInfoService } from '../service/account-holder-info.service';

import { AccountHolderInfoRoutingResolveService } from './account-holder-info-routing-resolve.service';

describe('AccountHolderInfo routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AccountHolderInfoRoutingResolveService;
  let service: AccountHolderInfoService;
  let resultAccountHolderInfo: IAccountHolderInfo | undefined;

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
    routingResolveService = TestBed.inject(AccountHolderInfoRoutingResolveService);
    service = TestBed.inject(AccountHolderInfoService);
    resultAccountHolderInfo = undefined;
  });

  describe('resolve', () => {
    it('should return IAccountHolderInfo returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountHolderInfo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAccountHolderInfo).toEqual({ id: 123 });
    });

    it('should return new IAccountHolderInfo if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountHolderInfo = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAccountHolderInfo).toEqual(new AccountHolderInfo());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AccountHolderInfo })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountHolderInfo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAccountHolderInfo).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
