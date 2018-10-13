import { browser, by, element } from 'protractor';

export class AppPage {
    navigateTo() {
        return browser.get('/');
    }

    getHeaderLogo() {
        return element.all(by.css('img[src="assets/images/logo.svg"')).first();
    }

    getFooterLogo() {
        return element.all(by.css('img[src="assets/images/logo.svg"')).last();
    }
}
