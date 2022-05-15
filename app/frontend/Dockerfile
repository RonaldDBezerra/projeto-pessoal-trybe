FROM node:16-alpine

WORKDIR /frotend

COPY package*.json /

RUN npm install -g npm@latest && npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"] 
