const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reservation = sequelize.define('Reservation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    amenityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'amenity_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    startTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'start_time',
      comment: 'Minutes from 00:00'
    },
    endTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'end_time',
      comment: 'Minutes from 00:00'
    },
    date: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Timestamp of the day at 00:00'
    }
  }, {
    tableName: 'reservations',
    timestamps: false,
    indexes: [
      {
        name: 'idx_reservation_amenity_date',
        fields: ['amenity_id', 'date']
      },
      {
        name: 'idx_reservation_user_date',
        fields: ['user_id', 'date']
      }
    ]
  });

  Reservation.associate = (models) => {
    Reservation.belongsTo(models.Amenity, {
      foreignKey: 'amenityId',
      as: 'amenity'
    });
  };

  return Reservation;
};
