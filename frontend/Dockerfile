# Build Stage: This stage compiles the React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY ./ /app/

RUN npm run build

# Production Stage: Use a lightweight Nginx image to serve the static assets produced in the build stage.
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
