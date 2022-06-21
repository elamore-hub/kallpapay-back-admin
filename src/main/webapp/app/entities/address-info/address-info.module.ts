import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AddressInfoComponent } from './list/address-info.component';
import { AddressInfoDetailComponent } from './detail/address-info-detail.component';
import { AddressInfoUpdateComponent } from './update/address-info-update.component';
import { AddressInfoDeleteDialogComponent } from './delete/address-info-delete-dialog.component';
import { AddressInfoRoutingModule } from './route/address-info-routing.module';

@NgModule({
  imports: [SharedModule, AddressInfoRoutingModule],
  declarations: [AddressInfoComponent, AddressInfoDetailComponent, AddressInfoUpdateComponent, AddressInfoDeleteDialogComponent],
  entryComponents: [AddressInfoDeleteDialogComponent],
})
export class AddressInfoModule {}
