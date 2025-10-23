const fs = require('fs');
const path = require('path');
const { Amenity, Reservation, sequelize } = require('../models');

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split(/\r?\n/);
  const headers = lines[0].split(';').map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(';').map(v => v.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
}

async function seed() {
  try {
    console.log('Starting database seeding...');

    await sequelize.sync({ force: true });

    const amenitiesPath = path.join(__dirname, '../../csv/Amenity (1).csv');
    const reservationsPath = path.join(__dirname, '../../csv/Reservations (1).csv');

    const amenitiesData = parseCSV(amenitiesPath);
    console.log(`Parsed ${amenitiesData.length} amenities`);

    await Amenity.bulkCreate(amenitiesData.map(item => ({
      id: parseInt(item.id),
      name: item.name
    })));
    console.log('Amenities seeded successfully');

    const reservationsData = parseCSV(reservationsPath);
    console.log(`Parsed ${reservationsData.length} reservations`);

    await Reservation.bulkCreate(reservationsData.map(item => ({
      id: parseInt(item.id),
      amenityId: parseInt(item.amenity_id),
      userId: parseInt(item.user_id),
      startTime: parseInt(item.start_time),
      endTime: parseInt(item.end_time),
      date: item.date
    })));
    console.log('Reservations seeded successfully');

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
