import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PortfolioComponent } from './list/portfolio.component';
import { PortfolioDetailComponent } from './detail/portfolio-detail.component';
import { PortfolioUpdateComponent } from './update/portfolio-update.component';
import { PortfolioDeleteDialogComponent } from './delete/portfolio-delete-dialog.component';
import { PortfolioRoutingModule } from './route/portfolio-routing.module';

@NgModule({
  imports: [SharedModule, PortfolioRoutingModule],
  declarations: [PortfolioComponent, PortfolioDetailComponent, PortfolioUpdateComponent, PortfolioDeleteDialogComponent],
  entryComponents: [PortfolioDeleteDialogComponent],
})
export class PortfolioModule {}
