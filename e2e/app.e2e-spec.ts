import { SpeechAiPage } from './app.po';

describe('speech-ai App', () => {
  let page: SpeechAiPage;

  beforeEach(() => {
    page = new SpeechAiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
