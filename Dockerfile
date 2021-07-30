FROM node:14.17-buster
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -y pg
RUN npm install -y pg-hstore
RUN npm install -y -g sequelize-cli
COPY . ./
CMD [ "node", "app.js" ]
EXPOSE 3000
