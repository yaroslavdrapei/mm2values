FROM node:slim

COPY /bot /app
WORKDIR app

RUN npm i

CMD ["npx", "tsx", "src/index.ts"]