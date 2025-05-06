FROM node:slim

COPY /scraper /app
WORKDIR app

RUN npm i

CMD ["npx", "tsx", "src/index.ts"]