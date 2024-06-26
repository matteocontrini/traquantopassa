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

Make sure to add missing credentials (Goatcounter is optional).

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

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
