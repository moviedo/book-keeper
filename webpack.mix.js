const mix = require('laravel-mix');
const process = require('process');

// NOTE: Don't remove this, Because it's the default public folder path on AdonisJs
mix.setPublicPath('public');

// Add your assets here
mix
  .ts('resources/assets/main.ts', 'scripts/app.js').vue({
    version: 3,
    extractStyles: process.env.NODE_ENV === 'production' ? 'styles/vue-app.css' : false
  })
  .extract()
  .sourceMaps();
