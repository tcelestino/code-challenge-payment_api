# Payment API

A REST API for payment services built with Node.js, Fastify, and TypeScript using hexagonal architecture.

## Architecture

This project follows the hexagonal architecture (ports and adapters) pattern:

- **Domain**: Contains business logic, entities, and interfaces
- **Application**: Contains use cases and service implementations
- **Infrastructure**: Contains external adapters (database, cache, external services)
- **Interfaces**: Contains HTTP controllers, routes, and schemas

## Prerequisites

- Node.js 20
- Docker
- Redis
- MySQL
- Yarn

## Getting Started

### Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

### Database Setup

Import the database schema:

```bash
mysql -u your_username -p < src/infrastructure/database/migrations/db.sql
```

### Running Locally

1. Install dependencies:

```bash
yarn install
```
2. Make sure you have MySQL and Redis running locally or update the `.env` file with the correct connection details.
3. Run mock server:

```bash
yarn mock:server
```
4. Start the application:

```bash
yarn dev
```

### Running production server

1. Build the application:

```bash
yarn build
```

2. Start the application:

```bash
yarn start
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/documentation
```

### API Endpoints

- `POST /api/v1/payments` - Create a new payment
- `GET /api/v1/payments/:paymentId` - Get payment by ID

## Testing

### Running Unit Tests

```bash
yarn test
```

### Running Integration Tests

```bash
yarn test:integration
```

## Features

- [ ] Create mock database
- [ ] Adding Docker and docker-compose
- [ ] Adjustintegration and unit tests
- [ ] Add API_KEY to the API request
- [ ] Add zod to schema validation
- [ ] Create migrations for the database using sequelize-cli
- [ ] Implement CI using Github Actions

## License

ISC
