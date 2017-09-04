import { PhoenixParserPage } from './app.po';

describe('phoenix-parser App', () => {
  let page: PhoenixParserPage;

  beforeEach(() => {
    page = new PhoenixParserPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
