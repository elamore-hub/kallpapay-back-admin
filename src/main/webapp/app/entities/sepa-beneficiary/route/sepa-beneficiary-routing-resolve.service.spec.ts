import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISEPABeneficiary, SEPABeneficiary } from '../sepa-beneficiary.model';
import { SEPABeneficiaryService } from '../service/sepa-beneficiary.service';

import { SEPABeneficiaryRoutingResolveService } from './sepa-beneficiary-routing-resolve.service';

describe('SEPABeneficiary routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SEPABeneficiaryRoutingResolveService;
  let service: SEPABeneficiaryService;
  let resultSEPABeneficiary: ISEPABeneficiary | undefined;

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
    routingResolveService = TestBed.inject(SEPABeneficiaryRoutingResolveService);
    service = TestBed.inject(SEPABeneficiaryService);
    resultSEPABeneficiary = undefined;
  });

  describe('resolve', () => {
    it('should return ISEPABeneficiary returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSEPABeneficiary = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSEPABeneficiary).toEqual({ id: 123 });
    });

    it('should return new ISEPABeneficiary if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSEPABeneficiary = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSEPABeneficiary).toEqual(new SEPABeneficiary());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SEPABeneficiary })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSEPABeneficiary = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSEPABeneficiary).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
