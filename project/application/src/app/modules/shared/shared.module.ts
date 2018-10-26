import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationModule } from 'angular-l10n';

import { AppearDirective } from './directives/appear.directive';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [LocalizationModule, CommonModule, ReactiveFormsModule],
    declarations: [AppearDirective],
    exports: [LocalizationModule, AppearDirective, CommonModule, ReactiveFormsModule],
})
export class SharedModule {}
