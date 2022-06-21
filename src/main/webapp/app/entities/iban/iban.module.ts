import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IBANComponent } from './list/iban.component';
import { IBANDetailComponent } from './detail/iban-detail.component';
import { IBANUpdateComponent } from './update/iban-update.component';
import { IBANDeleteDialogComponent } from './delete/iban-delete-dialog.component';
import { IBANRoutingModule } from './route/iban-routing.module';

@NgModule({
  imports: [SharedModule, IBANRoutingModule],
  declarations: [IBANComponent, IBANDetailComponent, IBANUpdateComponent, IBANDeleteDialogComponent],
  entryComponents: [IBANDeleteDialogComponent],
})
export class IBANModule {}
