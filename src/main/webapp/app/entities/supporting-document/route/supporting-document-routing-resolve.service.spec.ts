import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISupportingDocument, SupportingDocument } from '../supporting-document.model';
import { SupportingDocumentService } from '../service/supporting-document.service';

import { SupportingDocumentRoutingResolveService } from './supporting-document-routing-resolve.service';

describe('SupportingDocument routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SupportingDocumentRoutingResolveService;
  let service: SupportingDocumentService;
  let resultSupportingDocument: ISupportingDocument | undefined;

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
    routingResolveService = TestBed.inject(SupportingDocumentRoutingResolveService);
    service = TestBed.inject(SupportingDocumentService);
    resultSupportingDocument = undefined;
  });

  describe('resolve', () => {
    it('should return ISupportingDocument returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSupportingDocument = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSupportingDocument).toEqual({ id: 123 });
    });

    it('should return new ISupportingDocument if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSupportingDocument = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSupportingDocument).toEqual(new SupportingDocument());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SupportingDocument })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSupportingDocument = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSupportingDocument).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
