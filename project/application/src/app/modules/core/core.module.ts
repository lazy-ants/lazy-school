import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransferHttpModule } from '@gorniv/ngx-transfer-http';

import { RoutingModule } from '../routing/routing.module';

@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: 'lazy-school' }),
        BrowserTransferStateModule,
        BrowserAnimationsModule,
        RoutingModule,
        TransferHttpModule,
    ],
})
export class CoreModule {}
