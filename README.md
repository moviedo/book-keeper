# Bookkeeper
Bookkeeping app for determining monthly cost between multiple parties.

## Prerequisite

Install nodejs LTS. Make sure your node/npm versions are compaitiable with engine properties in package.json.

## Setup

Run the following commands for setup.

1. `npm i` installs dependencies
1. `node ace mix:build` run preprocessor (i.e. sass, etc)
1. Create a .env file
  ```
  PORT=3333
  HOST=localhost
  NODE_ENV=development
  APP_KEY=super secret app key, can be generated using `node ace generate:key`
  SESSION_DRIVER=cookie
  CACHE_VIEWS=false
  ```
1. `npm run dev:server` runs the dev server
1. Go to given server address and start using app.
