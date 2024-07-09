FROM node:18.19 as node
LABEL authors="anjabertels"

WORKDIR /app/zsb-frontend
RUN npm install -g @angular/cli
COPY package*.json ./
RUN npm install
COPY . .
RUN ng build --configuration production

# bestimmte Version nutzen
FROM nginx:stable-alpine
COPY --from=node /app/zsb-frontend/dist/zsb-frontend /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html/public
EXPOSE 4200
# CMD?
CMD ["nginx", "-g", "daemon off;"]
