import { vi } from 'vitest';

vi.mock('@infrastructure/cache/redis', () => ({
  cacheSet: vi.fn().mockResolvedValue(true),
  cacheGet: vi.fn().mockResolvedValue(null),
}));

//TODO: setup database using testcontainers
// this fix the issue of not able to connect to database in integration test

vi.mock('@config/environment', () => ({
  config: {
    externalService: {
      url: 'http://localhost:9000',
    },
    cache: {
      key: 'test-payment',
    },
    database: {
      host: 'localhost',
      port: 5432,
      name: 'test',
      user: 'test',
      password: 'test',
    },
    server: {
      port: 3000,
      nodeEnv: 'test',
    },
    redis: {
      host: 'localhost',
      port: 6379,
    },
  },
}));

global.fetch = vi.fn();

// beforeAll(async () => {
//   await sequelize.sync({ force: true });
// });

// afterAll(async () => {
//   await sequelize.close();
// });
