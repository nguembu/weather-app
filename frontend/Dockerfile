

# frontend/Dockerfile
FROM node:18

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Utilise nginx pour servir l'app
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
