import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModulesPro, MDBSpinningPreloader } from 'ng-uikit-pro-standard';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [HomeRoutingModule, SharedModule, MDBBootstrapModulesPro.forRoot()],
    declarations: [HomeComponent],
    providers: [MDBSpinningPreloader],
    schemas: [NO_ERRORS_SCHEMA],
})
export class HomeModule {}
