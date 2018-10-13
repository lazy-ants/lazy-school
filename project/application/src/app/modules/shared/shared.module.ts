import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationModule } from 'angular-l10n';

import { AppearDirective } from './directives/appear.directive';

@NgModule({
    imports: [LocalizationModule, CommonModule],
    declarations: [AppearDirective],
    exports: [LocalizationModule, AppearDirective, CommonModule],
})
export class SharedModule {}
