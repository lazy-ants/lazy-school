import { Component, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ServerAnimationService } from './modules/core/services/server-animation/server-animation.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'Welcome to angular ssr app!';

    constructor(public serverAnimationService: ServerAnimationService, private injector: Injector) {
        this.serverAnimationService.serverAnimationSubject.subscribe(active => {
            const document: Document = this.injector.get(DOCUMENT);
            document.body.classList.remove('loading');
        });
    }
}
