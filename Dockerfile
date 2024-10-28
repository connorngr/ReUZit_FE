# Step 1: Use an official Node.js image for building
FROM node:16 AS build
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

# Step 2: Use an Nginx server to serve the built files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
