import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';
import ssg from 'vite-plugin-ssr-ssg';
// PERBAIKAN: Impor sebagai default export (tanpa kurung kurawal)
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator';

let articleRoutes = [];
try {
  const articlesData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'public/articles.json'), 'utf-8'));
  articleRoutes = articlesData.map(article => `/${article.slug}`);
} catch (error) {
  console.warn('Could not read articles.json for prerendering. This is normal on the first build.');
}

export default defineConfig({
  plugins: [
    vue(),
    ssg({
      entry: 'src/main.js',
      format: 'esm',
      routes: [
        '/',
        '/categories',
        '/about',
        '/contact',
        '/privacy-policy',
        '/terms-of-service',
        ...articleRoutes
      ],
      crittersOptions: false,
      concurrency: 1,
    }),
    javascriptObfuscator({
      options: {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: 0,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: false,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: false,
        stringArray: true,
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
      },
      apply: 'build'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'prettify',
  },
});