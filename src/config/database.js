const path = require('path');

const config = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../db/rest-api.db'),
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../db/rest-api-test.db'),
    logging: false,
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
