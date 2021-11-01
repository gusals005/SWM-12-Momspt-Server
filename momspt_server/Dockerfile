FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install -g -y npm@8.1.2
RUN npm install
RUN npm install -y pg
RUN npm install -y form-data
RUN npm install -y pg-hstore
RUN npm install -y -g sequelize-cli
COPY . ./
CMD [ "node", "app.js" ]
EXPOSE 3000
