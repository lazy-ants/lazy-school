import {
    Component,
    OnInit,
    OnDestroy,
    Inject,
    PLATFORM_ID,
    AfterViewInit,
    ChangeDetectorRef,
    AfterViewChecked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from 'angular-l10n';
import { FormControl, Validators } from '@angular/forms';

import { SeoPropertiesService } from '../core/services/seo-properties/seo-properties.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    @Language()
    lang: string;
    inView: string;

    title = 'lazy-school';
    lat = 50.002257;
    lng = 36.250887;

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
    loginFormModalPassword = new FormControl('', Validators.required);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef,
        private seoPropertiesService: SeoPropertiesService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        this.setSeoProps();
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
            // Be attention! This statement is required by the Angular Universal's bug
            // I found today. The ngOnDestroy() hook calls every time on the server side
            // when the browser page refreshes.
            this.seoPropertiesService.removeSeoProps(this.route.snapshot.data.seoPropsToRemove);
        }
    }

    ngAfterViewInit(): void {
        this.route.fragment.subscribe(fragment => this.scrollToTheElement(fragment));
    }

    public scrollToTheElement(
        fragment: string,
        settings: any = { behavior: 'smooth', block: 'center', inline: 'center' }
    ) {
        setTimeout(() => {
            const element = document.querySelector(`#${fragment}`);
            if (!!element) {
                element.scrollIntoView(settings);
                const width = this.getWindowWidth();
                const activeMobileNav = document.querySelector('.show') ? true : false;
                if (width < 992 && activeMobileNav) {
                    (document.querySelector('button.navbar-toggler') as HTMLElement).click();
                }
            }
        }, 300);
    }

    private getWindowWidth() {
        return window.innerWidth || 0;
    }

    public setAnimationOnScroll(section) {
        this.animation[section] = true;
    }

    public scrollToFragment(fragment) {
        this.router.navigated = false;
        this.router.navigate(['/'], { fragment: `${fragment}` });
    }

    public isElementInView(event): void {
        this.inView = event.data;
    }

    private setSeoProps() {
        this.seoPropertiesService.setSeoProps(this.route.snapshot.data.seoProps);
    }
}
