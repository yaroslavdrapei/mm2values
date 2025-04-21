FROM node:slim

COPY package.json /
COPY tsconfig.json /
COPY /config /config
COPY /shared /shared
COPY /scraper /scraper

RUN npm i

CMD ["npx", "ts-node", "scraper/index.ts"]