import { Sequelize } from 'sequelize';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

let container: StartedTestContainer;
let sequelize: Sequelize;

export async function setupTestDatabase() {
  container = await new GenericContainer('mysql:8.0')
    .withExposedPorts(3306)
    .withEnvironment({
      MYSQL_ROOT_PASSWORD: 'test',
      MYSQL_DATABASE: 'payment_test',
    })
    .start();

  const port = container.getMappedPort(3306);
  const host = container.getHost();

  sequelize = new Sequelize('payment_test', 'root', 'test', {
    host,
    port,
    dialect: 'mysql',
    logging: false,
  });

  await sequelize.authenticate();
  console.log('Test database connection established successfully.');

  return sequelize;
}

export async function teardownTestDatabase() {
  if (sequelize) {
    await sequelize.close();
  }
  if (container) {
    await container.stop();
  }
}
