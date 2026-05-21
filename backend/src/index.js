require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectDB();

  const User = require('./models/User');
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Empty database — seeding sample data...');
    const seedData = require('./scripts/seed');
    await seedData();
  }

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(morgan('dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      message: { message: 'Too many requests' },
    })
  );

  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
  app.use('/api', routes);

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  });

  app.listen(PORT, () => {
    console.log(`Mosque Finance API running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
  });
}

bootstrap().catch((err) => {
  console.error('Startup failed:', err.message);
  process.exit(1);
});
