FROM node:16-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install -g npm@latest && npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"] 

