import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MyCauseComponent } from './list/my-cause.component';
import { MyCauseDetailComponent } from './detail/my-cause-detail.component';
import { MyCauseUpdateComponent } from './update/my-cause-update.component';
import { MyCauseDeleteDialogComponent } from './delete/my-cause-delete-dialog.component';
import { MyCauseRoutingModule } from './route/my-cause-routing.module';

@NgModule({
  imports: [SharedModule, MyCauseRoutingModule],
  declarations: [MyCauseComponent, MyCauseDetailComponent, MyCauseUpdateComponent, MyCauseDeleteDialogComponent],
  entryComponents: [MyCauseDeleteDialogComponent],
})
export class MyCauseModule {}
