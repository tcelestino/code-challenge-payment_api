import { config } from './config/environment';
// import { initializeDatabase } from './infrastructure/database/sequelize';
import { initializeRedis } from './infrastructure/cache/redis';
import { createServer } from './server';

const start = async () => {
  try {
    // Initialize database connection
    // await initializeDatabase();

    await initializeRedis();

    const server = await createServer();
    await server.listen({ port: config.server.port, host: '0.0.0.0' });

    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;

    console.log(`Server is running on port ${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
