const { Amenity, Reservation } = require('../db/models');

class ReservationsService {
  /**
   * Get all reservations for a specific amenity on a specific day
   * @param {number} amenityId - The ID of the amenity
   * @param {number} dayTimestamp - Unix timestamp in seconds representing the day (at 00:00)
   * @returns {Promise<Array<{reservationId: number, userId: number, startTime: string, duration: number, amenityName: string}>>}
   * @description Returns reservations sorted by start time in ascending order.
   * Start time is formatted as HH:MM and duration is in minutes.
   */
  async getReservationsByAmenityAndDate(amenityId, dayTimestamp) {
    const reservations = await Reservation.findAll({
      where: {
        amenityId: amenityId,
        date: dayTimestamp * 1000,
      },
      include: [
        {
          model: Amenity,
          as: 'amenity',
          attributes: ['name'],
        },
      ],
      order: [['startTime', 'ASC']],
    });

    return reservations.map((reservation) => {
      const startHours = Math.floor(reservation.startTime / 60);
      const startMinutes = reservation.startTime % 60;
      const duration = reservation.endTime - reservation.startTime;

      return {
        reservationId: reservation.id,
        userId: reservation.userId,
        startTime: `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`,
        duration: duration,
        amenityName: reservation.amenity.name,
      };
    });
  }

  /**
   * Get all reservations for a specific user, grouped by days
   * @param {number} userId - The ID of the user
   * @returns {Promise<Object<string, Array<{reservationId: number, amenityId: number, startTime: string, duration: number}>>>}
   */
  async getReservationsByUser(userId) {
    // Note:
    const reservations = await Reservation.findAll({
      where: {
        userId: userId,
      },
      order: [
        ['date', 'ASC'],
        ['startTime', 'ASC'],
      ],
    });

    const groupedByDay = {};

    reservations.forEach((reservation) => {
      const date = reservation.date;
      const startHours = Math.floor(reservation.startTime / 60);
      const startMinutes = reservation.startTime % 60;
      const duration = reservation.endTime - reservation.startTime;

      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }

      groupedByDay[date].push({
        reservationId: reservation.id,
        amenityId: reservation.amenityId,
        startTime: `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`,
        duration: duration,
      });
    });

    return groupedByDay;
  }
}

module.exports = new ReservationsService();
