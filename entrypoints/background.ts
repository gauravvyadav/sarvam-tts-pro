export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    const sarvamUrl = 'https://www.sarvam.ai/apis/text-to-speech';

    if (tab.url?.includes('sarvam.ai')) {
      // Already on the site, just toggle the sidebar
      if (tab.id) {
        browser.tabs.sendMessage(tab.id, { type: 'toggle-sidebar' }).catch((err) => {
          console.log('Sidebar not loaded on this page', err);
        });
      }
    } else {
      // Not on the site, open it and the sidebar will auto-open (via query param or default logic)
      browser.tabs.create({ url: `${sarvamUrl}?sarvam_tts_pro=open` });
    }
  });
});
