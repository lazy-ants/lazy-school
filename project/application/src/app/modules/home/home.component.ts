import { OnInit, Inject, OnDestroy, Component, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
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
    currentNavItem: string;
    title = 'lazy-school';
    location: any = {
        lat: 50.002257,
        lng: 36.250887,
    };
    activateSectionAvailable = false;
    activateSectionPromise: any;

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
    conferenceFormModalName = new FormControl('', Validators.required);
    conferenceFormModalPhone = new FormControl('', Validators.required);

    constructor(
        private route: ActivatedRoute,
        private seoPropertiesService: SeoPropertiesService,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: any
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
        const section = this.route.snapshot.fragment;
        this.setCurrentNavItem(section);
        this.scrollToSection(section);
        setTimeout(() => (this.activateSectionAvailable = true), 300);
    }

    public setAnimationOnScroll(section: string): void {
        this.animation[section] = true;
    }

    public navigateToSection(section: string): void {
        clearTimeout(this.activateSectionPromise);
        this.activateSectionPromise = setTimeout(() => {
            this.setCurrentNavItem(section);
            this.updateUrlWithSection(section);
            this.scrollToSection(section);
        }, 300);
    }

    public activateSection(event: any = {}): void {
        if (!!event && event.data) {
            clearTimeout(this.activateSectionPromise);
            this.activateSectionPromise = setTimeout(() => {
                const section = event.data;
                this.setCurrentNavItem(section);
                this.updateUrlWithSection(section);
            }, 300);
        }
    }

    private setSeoProps(): void {
        this.seoPropertiesService.setSeoProps(this.route.snapshot.data.seoProps);
    }

    private scrollToSection(section: string): void {
        const element = this.document.querySelector(`#${section}`);
        if (!!element) {
            const width = this.getWindowWidth();
            const diff = width < 992
                ? element.offsetTop - window.scrollY - 50
                : element.offsetTop - window.scrollY;
            window.scrollBy({top: diff, left: 0, behavior: 'smooth' });
        }
    }

    private updateUrlWithSection(section: string): void {
        if (isPlatformBrowser(this.platformId)) {
            window.history.replaceState({}, '', `/#${section}`);
        }
    }

    private setCurrentNavItem(section: string): void {
        this.currentNavItem = section;
        this.closeNavOnMobile();
    }

    private closeNavOnMobile(): void {
        const width = this.getWindowWidth();
        const activeMobileNav = this.document.querySelector('.show') ? true : false;
        if (width < 992 && activeMobileNav) {
            (this.document.querySelector('button.navbar-toggler') as HTMLElement).click();
        }
    }

    private getWindowWidth(): number {
        if (isPlatformBrowser(this.platformId)) {
            return window.innerWidth || 0;
        }

        return 0;
    }
}
