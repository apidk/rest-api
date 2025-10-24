const { sequelize } = require('./models');

/*
 * Note: This is simplified migration system, in prod version
 * we should use the ORM's migrations which are managed by
 * migration tables and are granular and able to be rolled back
 */
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
