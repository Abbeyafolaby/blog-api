/* eslint-disable no-undef */
import { setupDatabase, teardownDatabase, clearDatabase } from './setup.js';

beforeAll(async () => {
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
});

afterEach(async () => {
  await clearDatabase();
});


