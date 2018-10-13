import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';
import { MDBBootstrapModulesPro, MDBSpinningPreloader } from 'ng-uikit-pro-standard';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { I18nModule } from '../i18n/i18n.module';
import { SeoPropertiesService } from '../core/services/seo-properties/seo-properties.service';
import { DocumentTitleService } from '../core/services/document-title/document-title.service';
import { TransferStateService } from '../core/services/transfer-state/transfer-state.service';
import { DocumentMetaService } from '../core/services/document-meta/document-meta.service';
import { DocumentLinkService } from '../core/services/document-link/document-link.service';
import { HttpRequestDataService } from '../core/services/http-request-data/http-request-data.service';
import { TestingService } from '../core/http/testing/testing.service';

describe('HomeComponent', () => {
    let fixture: ComponentFixture<HomeComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, I18nModule, MDBBootstrapModulesPro.forRoot(), RouterTestingModule],
            declarations: [HomeComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            data: {
                                seoProps: {
                                    title: 'Lazy school',
                                },
                                seoPropsToRemove: {
                                    title: true,
                                },
                            },
                        },
                        fragment: {
                            subscribe: (fn: (value: Params) => void) => fn({}),
                        },
                    },
                },
                MDBSpinningPreloader,
                TransferState,
                TransferHttpService,
                TransferStateService,
                SeoPropertiesService,
                DocumentTitleService,
                DocumentMetaService,
                DocumentLinkService,
                HttpRequestDataService,
                TestingService,
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(HomeComponent);
    }));
    it('should create the app', async(() => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
