FROM node:18

WORKDIR /app
COPY . .

RUN apt update && apt install sed -y

RUN yarn install

RUN yarn build

EXPOSE 5000

CMD yarn start
