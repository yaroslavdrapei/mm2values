FROM node:slim

COPY /backend /app
WORKDIR app

RUN npm i
RUN npm run build

CMD ["npm", "run", "start:prod"]