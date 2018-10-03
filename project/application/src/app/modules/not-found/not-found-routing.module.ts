import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: NotFoundComponent,
        data: {
            seoProps: {
                title: 'Page not found',
                metaTags: [
                    {
                        name: 'description',
                        content: 'Lazy school',
                    },
                    {
                        name: 'keywords',
                        content: 'Lazy school',
                    },
                ],
                linkTags: [
                    {
                        rel: 'canonical',
                        href: 'https://lazy-school.lazy-ants.com',
                    },
                ],
            },
            seoPropsToRemove: {
                title: true,
                metaTagsSelectors: ['name="description"', 'name="keywords"'],
                linkTagsSelectors: ['rel="canonical"'],
            },
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class NotFoundRoutingModule {}
