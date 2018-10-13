import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Subject } from 'rxjs';

import { CoreModule } from '../../core.module';
import { BotCrawlerService } from '../bot-crawler/bot-crawler.service';

@Injectable({
    providedIn: CoreModule,
})
export class ServerAnimationService {
    public active = true;
    public serverAnimationSubject = new Subject<boolean>();
    private loadingTimeout = 500; // in ms

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private botCrawlerService: BotCrawlerService) {
        this.init();
    }

    private init() {
        this.botCrawlerService.checkIsCrawler().then((isCrawler: boolean) => {
            this.active = !isCrawler;
            if (isPlatformBrowser(this.platformId)) {
                setTimeout(() => {
                    this.active = false;
                    this.serverAnimationSubject.next(this.active);
                }, this.loadingTimeout);
            }
        });
    }
}
