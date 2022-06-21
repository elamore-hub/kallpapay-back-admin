import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SupportingDocumentComponent } from '../list/supporting-document.component';
import { SupportingDocumentDetailComponent } from '../detail/supporting-document-detail.component';
import { SupportingDocumentUpdateComponent } from '../update/supporting-document-update.component';
import { SupportingDocumentRoutingResolveService } from './supporting-document-routing-resolve.service';

const supportingDocumentRoute: Routes = [
  {
    path: '',
    component: SupportingDocumentComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SupportingDocumentDetailComponent,
    resolve: {
      supportingDocument: SupportingDocumentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SupportingDocumentUpdateComponent,
    resolve: {
      supportingDocument: SupportingDocumentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SupportingDocumentUpdateComponent,
    resolve: {
      supportingDocument: SupportingDocumentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(supportingDocumentRoute)],
  exports: [RouterModule],
})
export class SupportingDocumentRoutingModule {}
