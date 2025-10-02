// vite.config.js
import { defineConfig } from "file:///C:/wank/Adsense/konten/conten-kit/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/wank/Adsense/konten/conten-kit/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import fs from "fs";
import ssg from "file:///C:/wank/Adsense/konten/conten-kit/node_modules/vite-plugin-ssr-ssg/dist/index.esm.js";
import javascriptObfuscator from "file:///C:/wank/Adsense/konten/conten-kit/node_modules/vite-plugin-javascript-obfuscator/dist/index.cjs.js";
var __vite_injected_original_dirname = "C:\\wank\\Adsense\\konten\\conten-kit";
var articleRoutes = [];
try {
  const articlesData = JSON.parse(fs.readFileSync(path.resolve(__vite_injected_original_dirname, "public/articles.json"), "utf-8"));
  articleRoutes = articlesData.map((article) => `/${article.slug}`);
} catch (error) {
  console.warn("Could not read articles.json for prerendering. This is normal on the first build.");
}
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    ssg({
      entry: "src/main.js",
      format: "esm",
      routes: [
        "/",
        "/categories",
        "/about",
        "/contact",
        "/privacy-policy",
        "/terms-of-service",
        ...articleRoutes
      ],
      crittersOptions: false,
      concurrency: 1
    }),
    javascriptObfuscator({
      options: {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: 0,
        disableConsoleOutput: true,
        identifierNamesGenerator: "hexadecimal",
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
      apply: "build"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  ssgOptions: {
    script: "async",
    formatting: "prettify"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx3YW5rXFxcXEFkc2Vuc2VcXFxca29udGVuXFxcXGNvbnRlbi1raXRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHdhbmtcXFxcQWRzZW5zZVxcXFxrb250ZW5cXFxcY29udGVuLWtpdFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovd2Fuay9BZHNlbnNlL2tvbnRlbi9jb250ZW4ta2l0L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgc3NnIGZyb20gJ3ZpdGUtcGx1Z2luLXNzci1zc2cnO1xuLy8gUEVSQkFJS0FOOiBJbXBvciBzZWJhZ2FpIGRlZmF1bHQgZXhwb3J0ICh0YW5wYSBrdXJ1bmcga3VyYXdhbClcbmltcG9ydCBqYXZhc2NyaXB0T2JmdXNjYXRvciBmcm9tICd2aXRlLXBsdWdpbi1qYXZhc2NyaXB0LW9iZnVzY2F0b3InO1xuXG5sZXQgYXJ0aWNsZVJvdXRlcyA9IFtdO1xudHJ5IHtcbiAgY29uc3QgYXJ0aWNsZXNEYXRhID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3B1YmxpYy9hcnRpY2xlcy5qc29uJyksICd1dGYtOCcpKTtcbiAgYXJ0aWNsZVJvdXRlcyA9IGFydGljbGVzRGF0YS5tYXAoYXJ0aWNsZSA9PiBgLyR7YXJ0aWNsZS5zbHVnfWApO1xufSBjYXRjaCAoZXJyb3IpIHtcbiAgY29uc29sZS53YXJuKCdDb3VsZCBub3QgcmVhZCBhcnRpY2xlcy5qc29uIGZvciBwcmVyZW5kZXJpbmcuIFRoaXMgaXMgbm9ybWFsIG9uIHRoZSBmaXJzdCBidWlsZC4nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIHNzZyh7XG4gICAgICBlbnRyeTogJ3NyYy9tYWluLmpzJyxcbiAgICAgIGZvcm1hdDogJ2VzbScsXG4gICAgICByb3V0ZXM6IFtcbiAgICAgICAgJy8nLFxuICAgICAgICAnL2NhdGVnb3JpZXMnLFxuICAgICAgICAnL2Fib3V0JyxcbiAgICAgICAgJy9jb250YWN0JyxcbiAgICAgICAgJy9wcml2YWN5LXBvbGljeScsXG4gICAgICAgICcvdGVybXMtb2Ytc2VydmljZScsXG4gICAgICAgIC4uLmFydGljbGVSb3V0ZXNcbiAgICAgIF0sXG4gICAgICBjcml0dGVyc09wdGlvbnM6IGZhbHNlLFxuICAgICAgY29uY3VycmVuY3k6IDEsXG4gICAgfSksXG4gICAgamF2YXNjcmlwdE9iZnVzY2F0b3Ioe1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjb21wYWN0OiB0cnVlLFxuICAgICAgICBjb250cm9sRmxvd0ZsYXR0ZW5pbmc6IGZhbHNlLFxuICAgICAgICBkZWFkQ29kZUluamVjdGlvbjogZmFsc2UsXG4gICAgICAgIGRlYnVnUHJvdGVjdGlvbjogZmFsc2UsXG4gICAgICAgIGRlYnVnUHJvdGVjdGlvbkludGVydmFsOiAwLFxuICAgICAgICBkaXNhYmxlQ29uc29sZU91dHB1dDogdHJ1ZSxcbiAgICAgICAgaWRlbnRpZmllck5hbWVzR2VuZXJhdG9yOiAnaGV4YWRlY2ltYWwnLFxuICAgICAgICBsb2c6IGZhbHNlLFxuICAgICAgICBudW1iZXJzVG9FeHByZXNzaW9uczogZmFsc2UsXG4gICAgICAgIHJlbmFtZUdsb2JhbHM6IGZhbHNlLFxuICAgICAgICBzZWxmRGVmZW5kaW5nOiB0cnVlLFxuICAgICAgICBzaW1wbGlmeTogdHJ1ZSxcbiAgICAgICAgc3BsaXRTdHJpbmdzOiBmYWxzZSxcbiAgICAgICAgc3RyaW5nQXJyYXk6IHRydWUsXG4gICAgICAgIHN0cmluZ0FycmF5VGhyZXNob2xkOiAwLjc1LFxuICAgICAgICB1bmljb2RlRXNjYXBlU2VxdWVuY2U6IGZhbHNlXG4gICAgICB9LFxuICAgICAgYXBwbHk6ICdidWlsZCdcbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgc3NnT3B0aW9uczoge1xuICAgIHNjcmlwdDogJ2FzeW5jJyxcbiAgICBmb3JtYXR0aW5nOiAncHJldHRpZnknLFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUErUixTQUFTLG9CQUFvQjtBQUM1VCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sUUFBUTtBQUNmLE9BQU8sU0FBUztBQUVoQixPQUFPLDBCQUEwQjtBQU5qQyxJQUFNLG1DQUFtQztBQVF6QyxJQUFJLGdCQUFnQixDQUFDO0FBQ3JCLElBQUk7QUFDRixRQUFNLGVBQWUsS0FBSyxNQUFNLEdBQUcsYUFBYSxLQUFLLFFBQVEsa0NBQVcsc0JBQXNCLEdBQUcsT0FBTyxDQUFDO0FBQ3pHLGtCQUFnQixhQUFhLElBQUksYUFBVyxJQUFJLFFBQVEsSUFBSSxFQUFFO0FBQ2hFLFNBQVMsT0FBTztBQUNkLFVBQVEsS0FBSyxtRkFBbUY7QUFDbEc7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsTUFDRixPQUFPO0FBQUEsTUFDUCxRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQSxHQUFHO0FBQUEsTUFDTDtBQUFBLE1BQ0EsaUJBQWlCO0FBQUEsTUFDakIsYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLElBQ0QscUJBQXFCO0FBQUEsTUFDbkIsU0FBUztBQUFBLFFBQ1AsU0FBUztBQUFBLFFBQ1QsdUJBQXVCO0FBQUEsUUFDdkIsbUJBQW1CO0FBQUEsUUFDbkIsaUJBQWlCO0FBQUEsUUFDakIseUJBQXlCO0FBQUEsUUFDekIsc0JBQXNCO0FBQUEsUUFDdEIsMEJBQTBCO0FBQUEsUUFDMUIsS0FBSztBQUFBLFFBQ0wsc0JBQXNCO0FBQUEsUUFDdEIsZUFBZTtBQUFBLFFBQ2YsZUFBZTtBQUFBLFFBQ2YsVUFBVTtBQUFBLFFBQ1YsY0FBYztBQUFBLFFBQ2QsYUFBYTtBQUFBLFFBQ2Isc0JBQXNCO0FBQUEsUUFDdEIsdUJBQXVCO0FBQUEsTUFDekI7QUFBQSxNQUNBLE9BQU87QUFBQSxJQUNULENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxZQUFZO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsRUFDZDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
