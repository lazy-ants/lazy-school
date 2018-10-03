import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            seoProps: {
                title: 'Lazy school',
            },
            seoPropsToRemove: {
                title: true,
            },
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class HomeRoutingModule {}
