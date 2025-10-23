const { Sequelize } = require('sequelize');
const dbConfig = require('../../config/database');

const sequelize = new Sequelize({
  ...dbConfig,
  define: {
    freezeTableName: true,
  },
});

const Amenity = require('./Amenity')(sequelize);
const Reservation = require('./Reservation')(sequelize);
const User = require('./User')(sequelize);

const models = {
  Amenity,
  Reservation,
  User,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
