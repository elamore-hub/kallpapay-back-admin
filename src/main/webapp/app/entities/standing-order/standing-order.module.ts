import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StandingOrderComponent } from './list/standing-order.component';
import { StandingOrderDetailComponent } from './detail/standing-order-detail.component';
import { StandingOrderUpdateComponent } from './update/standing-order-update.component';
import { StandingOrderDeleteDialogComponent } from './delete/standing-order-delete-dialog.component';
import { StandingOrderRoutingModule } from './route/standing-order-routing.module';

@NgModule({
  imports: [SharedModule, StandingOrderRoutingModule],
  declarations: [StandingOrderComponent, StandingOrderDetailComponent, StandingOrderUpdateComponent, StandingOrderDeleteDialogComponent],
  entryComponents: [StandingOrderDeleteDialogComponent],
})
export class StandingOrderModule {}
