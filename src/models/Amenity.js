const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Amenity = sequelize.define('Amenity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'amenities',
    timestamps: false
  });

  Amenity.associate = (models) => {
    Amenity.hasMany(models.Reservation, {
      foreignKey: 'amenityId',
      as: 'reservations'
    });
  };

  return Amenity;
};
