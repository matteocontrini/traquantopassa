FROM node:24-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .
ARG PUBLIC_BASE_URL=https://traquantopassa.in
# Build validation needs placeholders; real API credentials are supplied at runtime.
RUN API_BASE_URL=https://app-tpl.tndigit.it API_USERNAME=build API_PASSWORD=build npm run build \
    && npm prune --omit=dev --ignore-scripts

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build

USER node
EXPOSE 3000
CMD ["node", "build"]
