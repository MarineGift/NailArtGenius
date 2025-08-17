FROM node:18
WORKDIR /app
COPY .npmrc package.json ./
RUN npm install --no-package-lock
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
