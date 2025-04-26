FROM node:slim

COPY package.json /
COPY tsconfig.json /
COPY /config /config
COPY /shared /shared
COPY /backend /backend

RUN npm i

CMD ["npx", "ts-node", "--transpile-only", "backend/index.ts"]