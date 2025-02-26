FROM node:22

WORKDIR /app

COPY package.json /app
COPY commands.json /app
COPY db.json /app
COPY tsconfig.json /app
COPY .env /app

COPY src/ /app/src

RUN npm i

CMD ["npx", "ts-node", "src/index.ts"]
