<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

 <p align="center">Mazagas API</p>

## About

Mazagas API

## Links

- API `http://localhost:3000`
- Swagger `http://localhost:3000/docs`
- Prisma Studio `http://localhost:5555`

## Setup

```bash
$ npm install
```

```bash
$ docker compose up -d
```

```bash
$ npx prisma migrate dev
```

```bash
# seed database
$ npm run prisma:seed
```

## Running

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Prisma Commands

```bash
# generate prisma client
$ npx prisma generate

# migrate database
$ npx prisma migrate dev

# reset database
$ npx prisma migrate reset

# generate migration
$ npx prisma migrate dev --name <name>

# seed database
$ npx prisma db seed

# open prisma studio
$ npx prisma studio
```
