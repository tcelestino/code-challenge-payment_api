import { vi } from 'vitest';

vi.mock('@infrastructure/cache/redis', () => ({
  cacheSet: vi.fn().mockResolvedValue(true),
  cacheGet: vi.fn().mockResolvedValue(null),
}));

// vi.mock('@config/environment', () => ({
//   config: {
//     externalService: {
//       url: 'http://localhost:9000',
//     },
//     cache: {
//       key: 'test-payment',
//     },
//   },
// }));

global.fetch = vi.fn();

// beforeAll(async () => {
//   await sequelize.sync({ force: true });
// });

// afterAll(async () => {
//   await sequelize.close();
// });
