{
  "name": "bzagc-addict",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "node ./scripts/build-manager.js",
    "build:full": "npm run clean:cache && npm run generate && vite build",
    "build:site": "vite build",
    "prerender:run": "node ./scripts/prerender.js",
    "generate": "node ./scripts/generate-content.js",
    "preview": "vite preview",
    "clean:cache": "rm -f .generate-cache.json",
    "reset:content": "npm run clean:cache && rm -f public/articles.json",
    "test:generate": "node ./scripts/generate-content.js"
  },
  "dependencies": {
    "@google/generative-ai": "^0.16.0",
    "@unhead/vue": "^1.9.16",
    "axios": "^1.11.0",
    "cheerio": "^1.1.2",
    "markdown-it": "^14.1.0",
    "vue": "^3.4.31",
    "vue-router": "^4.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.5",
    "concurrently": "^9.2.1",
    "dotenv": "^16.4.5",
    "puppeteer": "^24.19.0",
    "vite": "^5.3.4",
    "vite-plugin-javascript-obfuscator": "^3.1.0",
    "vite-plugin-ssr-ssg": "^1.4.1"
  }
}
