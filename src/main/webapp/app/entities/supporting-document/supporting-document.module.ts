import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SupportingDocumentComponent } from './list/supporting-document.component';
import { SupportingDocumentDetailComponent } from './detail/supporting-document-detail.component';
import { SupportingDocumentUpdateComponent } from './update/supporting-document-update.component';
import { SupportingDocumentDeleteDialogComponent } from './delete/supporting-document-delete-dialog.component';
import { SupportingDocumentRoutingModule } from './route/supporting-document-routing.module';

@NgModule({
  imports: [SharedModule, SupportingDocumentRoutingModule],
  declarations: [
    SupportingDocumentComponent,
    SupportingDocumentDetailComponent,
    SupportingDocumentUpdateComponent,
    SupportingDocumentDeleteDialogComponent,
  ],
  entryComponents: [SupportingDocumentDeleteDialogComponent],
})
export class SupportingDocumentModule {}
