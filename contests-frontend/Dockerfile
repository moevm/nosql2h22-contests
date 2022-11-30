FROM node:18-slim

WORKDIR contests-frontend

COPY . .

RUN npm install --legacy-peer-deps

CMD ["npm", "start"]