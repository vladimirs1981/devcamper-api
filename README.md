# DevCamper API

> Backend API for DevCamper application, which is bootcamp directory website

## Usage

Rename ".env.example" to ".env" and update values/settings to your own

## Install dependencies

```
npm install
```

## Build app

```
npm run build
```

## Run app

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database

```
# Seed database
npm run db:seed

# Drop database
npm run db:drop
```

## Run app with Docker

```
# First time build and run containers
docker-compose up -d --build

# Every next time
docker-compose up

# Stop containers
docker-compose down
```

## Documentation

```
http://localhost:5000/
```

- Version: 1.0.0
- License: MIT
