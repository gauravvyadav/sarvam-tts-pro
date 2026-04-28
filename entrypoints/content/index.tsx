import './Sidebar.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Sidebar from './Sidebar';

export default defineContentScript({
  matches: ['*://*.sarvam.ai/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'sarvam-tts-downloader',
      position: 'inline',
      anchor: 'body',
      append: 'last',
      onMount: (container: HTMLElement) => {
        const root = ReactDOM.createRoot(container);
        root.render(<Sidebar />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
