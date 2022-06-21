import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CauseComponent } from './list/cause.component';
import { CauseDetailComponent } from './detail/cause-detail.component';
import { CauseUpdateComponent } from './update/cause-update.component';
import { CauseDeleteDialogComponent } from './delete/cause-delete-dialog.component';
import { CauseRoutingModule } from './route/cause-routing.module';

@NgModule({
  imports: [SharedModule, CauseRoutingModule],
  declarations: [CauseComponent, CauseDetailComponent, CauseUpdateComponent, CauseDeleteDialogComponent],
  entryComponents: [CauseDeleteDialogComponent],
})
export class CauseModule {}
