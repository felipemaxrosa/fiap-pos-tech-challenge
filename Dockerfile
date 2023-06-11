FROM node:18.16-alpine

WORKDIR /fast-n-foodious

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]