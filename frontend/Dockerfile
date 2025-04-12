FROM node:18.17.0 as build

WORKDIR /usr/src/app

COPY package.json ./
RUN npm run setup

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80