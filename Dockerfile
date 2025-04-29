FROM oven/bun:1.2.10

WORKDIR /app

RUN bun add -g @angular/cli@19

COPY bun.lock ./
COPY package.json ./
RUN bun install

COPY . .

EXPOSE 4200
CMD ["ng","serve"]
