const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../db/rest-api.db'),
  logging: false,
  define: {
    freezeTableName: true
  }
});

const Amenity = require('./Amenity')(sequelize);
const Reservation = require('./Reservation')(sequelize);
const User = require('./User')(sequelize);

const models = {
  Amenity,
  Reservation,
  User
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models
};
