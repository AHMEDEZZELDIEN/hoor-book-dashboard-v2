FROM node:14.20.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:14.20.0

RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i 's|security.debian.org/debian-security|archive.debian.org/debian-security|g' /etc/apt/sources.list && \
    apt-get update && apt-get install -y nginx && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app /app

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
