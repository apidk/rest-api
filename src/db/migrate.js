const { sequelize } = require('../models');

async function migrate() {
  try {
    console.log('Starting database migration...');

    await sequelize.sync({ force: true });

    console.log('Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
