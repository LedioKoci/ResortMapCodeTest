const fs = require('fs');

class BookingStore {
    constructor(bookingsPath) {
        const data = fs.readFileSync(bookingsPath, 'utf8');
        this.validGuests = JSON.parse(data);
        this.bookedCabanas = new Set(); 
    }

    isValidGuest(room, guestName) {
        return this.validGuests.some(g => g.room === room && g.guestName === guestName);
    }

    isBooked(x, y) {
        return this.bookedCabanas.has(`${x},${y}`);
    }

    book(x, y, room, guestName) {
        if (!this.isValidGuest(room, guestName)) {
            return { success: false, message: 'Validation failed: room and guest name do not match our records.' };
        }
        if (this.isBooked(x, y)) {
            return { success: false, message: 'Cabana is already booked.' };
        }
        
        this.bookedCabanas.add(`${x},${y}`);
        return { success: true };
    }

    getAllBookings() {
        return Array.from(this.bookedCabanas);
    }
}

module.exports = BookingStore;