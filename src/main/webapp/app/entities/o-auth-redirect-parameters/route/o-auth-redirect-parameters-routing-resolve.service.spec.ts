import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IOAuthRedirectParameters, OAuthRedirectParameters } from '../o-auth-redirect-parameters.model';
import { OAuthRedirectParametersService } from '../service/o-auth-redirect-parameters.service';

import { OAuthRedirectParametersRoutingResolveService } from './o-auth-redirect-parameters-routing-resolve.service';

describe('OAuthRedirectParameters routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OAuthRedirectParametersRoutingResolveService;
  let service: OAuthRedirectParametersService;
  let resultOAuthRedirectParameters: IOAuthRedirectParameters | undefined;

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
    routingResolveService = TestBed.inject(OAuthRedirectParametersRoutingResolveService);
    service = TestBed.inject(OAuthRedirectParametersService);
    resultOAuthRedirectParameters = undefined;
  });

  describe('resolve', () => {
    it('should return IOAuthRedirectParameters returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOAuthRedirectParameters = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOAuthRedirectParameters).toEqual({ id: 123 });
    });

    it('should return new IOAuthRedirectParameters if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOAuthRedirectParameters = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOAuthRedirectParameters).toEqual(new OAuthRedirectParameters());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as OAuthRedirectParameters })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOAuthRedirectParameters = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOAuthRedirectParameters).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
