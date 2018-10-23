import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModulesPro, MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { AgmCoreModule } from '@agm/core';
import { NgInviewModule } from 'angular-inport';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { AppSettingsConfig } from '../../configs/app-settings.config';

@NgModule({
    imports: [
        HomeRoutingModule,
        SharedModule,
        NgInviewModule,
        AgmCoreModule.forRoot({
            apiKey: AppSettingsConfig.agmCoreModuleApiKey,
        }),
        MDBBootstrapModulesPro.forRoot(),
    ],
    declarations: [HomeComponent],
    providers: [MDBSpinningPreloader],
    schemas: [NO_ERRORS_SCHEMA],
})
export class HomeModule {}
