FROM node:20-alpine
WORKDIR /app
COPY dist /app
RUN npm install -g serve
CMD ["serve", "-s", "/app", "-l", "80"]