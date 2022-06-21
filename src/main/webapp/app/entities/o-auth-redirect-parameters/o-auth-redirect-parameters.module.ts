import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OAuthRedirectParametersComponent } from './list/o-auth-redirect-parameters.component';
import { OAuthRedirectParametersDetailComponent } from './detail/o-auth-redirect-parameters-detail.component';
import { OAuthRedirectParametersUpdateComponent } from './update/o-auth-redirect-parameters-update.component';
import { OAuthRedirectParametersDeleteDialogComponent } from './delete/o-auth-redirect-parameters-delete-dialog.component';
import { OAuthRedirectParametersRoutingModule } from './route/o-auth-redirect-parameters-routing.module';

@NgModule({
  imports: [SharedModule, OAuthRedirectParametersRoutingModule],
  declarations: [
    OAuthRedirectParametersComponent,
    OAuthRedirectParametersDetailComponent,
    OAuthRedirectParametersUpdateComponent,
    OAuthRedirectParametersDeleteDialogComponent,
  ],
  entryComponents: [OAuthRedirectParametersDeleteDialogComponent],
})
export class OAuthRedirectParametersModule {}
