import { OnInit, Inject, OnDestroy, Component, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Language } from 'angular-l10n';

import { SeoPropertiesService } from '../core/services/seo-properties/seo-properties.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
    @Language()
    lang: string;
    inView: string;
    title = 'lazy-school';
    lat = 50.002257;
    lng = 36.250887;
    animationDelay: any;

    animation = {
        aboutUs: false,
        rentLectory: false,
        rentConference: false,
        masterContent: false,
        masterPhone: false,
        masterEmail: false,
        mapDescription: false,
    };

    lectoryFormModalName = new FormControl('', Validators.required);
    lectoryFormModalPhone = new FormControl('', Validators.required);
    loginFormModalPassword = new FormControl('', Validators.required);
    conferenceFormModalName = new FormControl('', Validators.required);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private seoPropertiesService: SeoPropertiesService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        this.setSeoProps();
    }

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId)) {
            // Be attention! This statement is required by the Angular Universal's bug
            // I found today. The ngOnDestroy() hook calls every time on the server side
            // when the browser page refreshes.
            this.seoPropertiesService.removeSeoProps(this.route.snapshot.data.seoPropsToRemove);
        }
    }

    ngAfterViewInit(): void {
        this.route.fragment.subscribe(fragment => {
            if (isPlatformBrowser(this.platformId)) {
                clearTimeout(this.animationDelay);
                this.animationDelay = setTimeout(() => {
                    this.scrollToTheElement(fragment);
                }, 300);
            } else {
                this.scrollToTheElement(fragment);
            }
        });
    }

    public scrollToTheElement(
        fragment: string,
        settings: any = { behavior: 'smooth', block: 'center', inline: 'center' }
    ): void {
        const element = document.querySelector(`#${fragment}`);
        if (!!element) {
            this.inView = fragment;
            element.scrollIntoView(settings);
            const width = this.getWindowWidth();
            const activeMobileNav = document.querySelector('.show') ? true : false;
            if (width < 992 && activeMobileNav) {
                (document.querySelector('button.navbar-toggler') as HTMLElement).click();
            }
        }
    }

    public setAnimationOnScroll(section: string): void {
        this.animation[section] = true;
    }

    public scrollToFragment(fragment): void {
        this.router.navigated = false;
        this.router.navigate(['/'], { fragment: `${fragment}` });
    }

    public isElementInView(event: any = {}): void {
        if (!!event && event.data) {
            this.scrollToFragment(event.data);
        }
    }

    private setSeoProps(): void {
        this.seoPropertiesService.setSeoProps(this.route.snapshot.data.seoProps);
    }

    private getWindowWidth(): number {
        return window.innerWidth || 0;
    }
}
