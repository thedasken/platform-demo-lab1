FROM node:20-slim

WORKDIR /src

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8080

USER node

CMD ["node", "src/app.js"]
