<p align="center">
  <a><img src="https://i.imgur.com/BMJr4VC.png" width="100" alt="Fido Finder Logo" /></a>
</p>

  <p align="center">Fido Finder is a web application that runs with <a href="https://nestjs.com" target="_blank">nestjs</a>, a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a><img src="https://img.shields.io/badge/npm-v10.3.10-blue" alt="NPM Version" /></a>
<a><img src="https://img.shields.io/badge/license-AGPL%20v3-green" alt="Package License" /></a>
<a><img src="https://img.shields.io/badge/build-passing-4cca22" alt="Build" /></a>
<a><img src="https://img.shields.io/badge/coverage-10%25-green" alt="Coverage" /></a>
</p>

## Description

Fido Finder is a web application where users can post information about their lost pets, including the location where they were lost, pet's name, a photo (optional), and the owner's contact information. Users can prioritize viewing lost pets nearby by sharing their location. The platform facilitates direct contact between the finder and the owner and promotes quick collaboration in locating lost pets.

## Installation

```bash
$ npm install
```

## Running postgis docker container

Option 1 (Recommended)

```bash
# This will create postgis container and a working db
$ npm run db:dev:restart
```

Option 2

```bash
# This will create postgis container and a empty db
$ docker pull postgis/postgis
$ docker run --name postgis -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgis/postgis
```

## Configure prisma client

```bash
# Generate Prisma Client with the following command
$ prisma generate
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Useful dev commands

### Prisma

```bash
# Pull schema
$ npx prisma db pull
```

### Prisma studio

```bash
# open prisma studio
$ npx prisma studio

# open prisma studio > test
$ npx dotenv -e .env.test -- prisma studio
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deploy using docker

```
docker compose build
```

```
docker compose up -d
```

## Support

This is an open-source project licensed under AGPLv3. It can grow thanks to the sponsors and the support of the amazing contributors.

## Stay in touch

- [Carlos Mercado](https://github.com/carlosxmerca)
- [Victor Peraza](https://github.com/Peraza32)
- [Daniel Solis](https://github.com/DanielSolis00209020)
- [Diego Rivas](https://github.com/rivasdiego-dev)
- [Miguel Acosta](https://github.com/Acostam331)

## License

Fido Finder is [AGPL v3 Licensed](LICENSE).
