import { OnInit, Inject, OnDestroy, Component, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Language, TranslationService } from 'angular-l10n';
import { Subscription } from 'rxjs';

import { SeoPropertiesService } from '../core/services/seo-properties/seo-properties.service';
import { AppSettingsConfig } from '../../configs/app-settings.config';

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
    contacts: any = {
        location: {},
        phone: '',
        email: '',
    };
    booking: any = {
        email: {
            lectorySubject: '',
            conferenceSubject: '',
        },
    };
    activateSectionAvailable = false;
    activateSectionPromise: any;

    animation = {
        aboutUs: false,
        rentLectory: false,
        rentConference: false,
        masterContent: false,
        contacts: false,
    };

    lectoryFormModalName = new FormControl('');
    lectoryFormModalPhone = new FormControl('');
    conferenceFormModalName = new FormControl('');
    conferenceFormModalPhone = new FormControl('');

    sendEmailSubscriber: Subscription;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private seoPropertiesService: SeoPropertiesService,
        private translation: TranslationService,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: any
    ) {}

    ngOnInit(): void {
        this.setSeoProps();
        this.translation.translationChanged().subscribe(() => {
            this.contacts.location = this.translation.translate('location');
            this.contacts.phone = this.translation.translate('phone');
            this.contacts.email = this.translation.translate('email');
            this.booking.email.lectorySubject = this.translation.translate('booking.email.lectory-subject');
            this.booking.email.conferenceSubject = this.translation.translate('booking.email.conference-subject');
        });
    }

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId)) {
            // Be attention! This statement is required by the Angular Universal's bug
            // I found today. The ngOnDestroy() hook calls every time on the server side
            // when the browser page refreshes.
            this.seoPropertiesService.removeSeoProps(this.route.snapshot.data.seoPropsToRemove);
            if (!!this.sendEmailSubscriber) {
                this.sendEmailSubscriber.unsubscribe();
            }
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

    public lectoryBooking() {
        if (this.lectoryFormModalPhone.value) {
            this.sendEmail(
                this.lectoryFormModalName.value,
                this.lectoryFormModalPhone.value,
                this.booking.email.lectorySubject
            );
            this.lectoryFormModalName.reset();
            this.lectoryFormModalPhone.reset();
        }
    }

    public conferenceBooking() {
        if (this.conferenceFormModalPhone.value) {
            this.sendEmail(
                this.conferenceFormModalName.value,
                this.conferenceFormModalPhone.value,
                this.booking.email.conferenceSubject
            );
            this.conferenceFormModalName.reset();
            this.conferenceFormModalPhone.reset();
        }
    }

    private setSeoProps(): void {
        this.seoPropertiesService.setSeoProps(this.route.snapshot.data.seoProps);
    }

    private sendEmail(name: string, phone: string, subject: string) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        const data = {
            emailSendConfig: AppSettingsConfig.emailSendConfig,
            emailTo: this.contacts.email,
            subject,
            body: `
                Имя: ${name || '-'},
                Телефон: ${phone}
            `,
        };

        this.sendEmailSubscriber = this.http
            .post('https://lazy-school.lazy-ants.com/api/send-email', data, { headers })
            .subscribe(response => {}, error => {});
    }

    private scrollToSection(section: string): void {
        const element = this.document.querySelector(`#${section}`);
        if (!!element && isPlatformBrowser(this.platformId)) {
            const width = this.getWindowWidth();
            window.scrollTo({
                top: width < 992 ? element.offsetTop - 50 : element.offsetTop,
                behavior: 'smooth',
            });
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
