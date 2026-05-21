/**
 * Creates and seeds the database (works without local MongoDB installed).
 * Usage: npm run create
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
process.env.USE_MEMORY_DB = 'true';

const connectDB = require('../config/db');
const { disconnectDB } = require('../config/db');
const seedData = require('./seed');

async function run() {
  console.log('\n🕌 Creating mosque finance database...\n');
  await connectDB();
  await seedData();
  await disconnectDB();
  console.log('✅ Database created and seeded successfully.\n');
  console.log('Start the app:');
  console.log('  Terminal 1: cd backend && npm run dev');
  console.log('  Terminal 2: cd frontend && npm run dev');
  console.log('  Open: http://localhost:3000\n');
  process.exit(0);
}

run().catch((e) => {
  console.error('Create failed:', e.message);
  process.exit(1);
});
