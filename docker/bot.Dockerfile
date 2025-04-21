FROM node:slim

COPY package.json /
COPY tsconfig.json /
COPY commands.json /
COPY /config /config
COPY /shared /shared
COPY /bot /bot

RUN npm i

CMD ["npx", "ts-node", "bot/index.ts"]