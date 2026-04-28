import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    default_locale: 'en',
    name: '__MSG_extensionName__',
    description: '__MSG_extensionDesc__',
    version: '0.1.0',
    permissions: ['storage', 'tabs'],
    action: {
      default_title: 'Open Sarvam TTS Pro',
    },
    icons: {
      '16': 'icon/16.png',
      '32': 'icon/32.png',
      '48': 'icon/48.png',
      '128': 'icon/128.png',
    },
  },
  vite: (env) => ({
    build: {
      minify: env.command === 'build' ? 'terser' : false,
      terserOptions: env.command === 'build' ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2,
        },
        format: {
          comments: false,
        },
      } : undefined,
      sourcemap: env.command !== 'build',
    },
  }),
});
