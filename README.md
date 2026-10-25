# Tra quanto passa

*Tra quanto passa* is a simple web application that shows the arrival times of **buses** in the city of Trento and **trains** information for some popular stations in Northeast Italy.

It also takes into consideration delays based on real-time data, for both buses and trains.

It's currently hosted on [traquantopassa.in](https://traquantopassa.in).

The application is built with the SvelteKit framework (previously Nuxt 3).

## Development

Create a `.env` file with the following content:

```
PUBLIC_BASE_URL=https://traquantopassa.in
API_BASE_URL=https://app-tpl.tndigit.it
API_USERNAME=
API_PASSWORD=
GOATCOUNTER_API_KEY=
```

`API_BASE_URL`, `API_USERNAME`, and `API_PASSWORD` are mandatory. Goatcounter is optional.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Formatting and linting

Code formatting is handled by [Prettier](https://prettier.io/) and enforced in CI. To format the whole repository:

```bash
npm run format
```

To check formatting and run [ESLint](https://eslint.org/), as CI does:

```bash
npm run lint
```

TypeScript and Svelte compiler errors are caught by [`svelte-check`](https://www.npmjs.com/package/svelte-check):

```bash
npm run check
```

Editor configuration is committed so both editors run Prettier and ESLint on save:

- **VS Code**: install the recommended [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extensions (see `.vscode/extensions.json`).
- **WebStorm**: works out of the box via `.idea/prettier.xml` and `.idea/jsLinters/eslint.xml`. Both set a custom file pattern, because WebStorm's default omits `.svelte`.

## Production

Build the application:

```bash
npm ci
npm run build
```

Start the production server (you can pass configuration options with environment variables or the `.env` file):

```bash
npm start
```
