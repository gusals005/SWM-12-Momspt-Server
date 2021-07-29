FROM node:14.17-buster
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
CMD [ "node", "app.js" ]
EXPOSE 3000
