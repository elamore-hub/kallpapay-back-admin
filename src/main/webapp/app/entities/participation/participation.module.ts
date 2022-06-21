import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParticipationComponent } from './list/participation.component';
import { ParticipationDetailComponent } from './detail/participation-detail.component';
import { ParticipationUpdateComponent } from './update/participation-update.component';
import { ParticipationDeleteDialogComponent } from './delete/participation-delete-dialog.component';
import { ParticipationRoutingModule } from './route/participation-routing.module';

@NgModule({
  imports: [SharedModule, ParticipationRoutingModule],
  declarations: [ParticipationComponent, ParticipationDetailComponent, ParticipationUpdateComponent, ParticipationDeleteDialogComponent],
  entryComponents: [ParticipationDeleteDialogComponent],
})
export class ParticipationModule {}
