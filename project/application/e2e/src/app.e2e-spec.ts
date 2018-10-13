import { AppPage } from './app.po';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display header logo', () => {
        page.navigateTo();
        expect(page.getHeaderLogo().getAttribute('alt')).toEqual('lazy-school');
    });

    it('should display footer logo', () => {
        page.navigateTo();
        expect(page.getFooterLogo().getAttribute('alt')).toEqual('lazy-school');
    });
});
