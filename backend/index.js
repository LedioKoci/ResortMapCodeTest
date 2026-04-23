const express = require('express');
const cors = require('cors');
const minimist = require('minimist');
const { parseMap } = require('./mapParser');
const BookingStore = require('./bookingStore');

const app = express();
app.use(cors());
app.use(express.json());

// i implemented this to parse any kind of file we would want to use, otherwise it uses the ones by defualt
const args = minimist(process.argv.slice(2));
const mapPath = args.map || '../map.ascii';
const bookingsPath = args.bookings || '../bookings.json';

const grid = parseMap(mapPath);
const store = new BookingStore(bookingsPath);


app.get('/api/map', (req, res) => {
    res.json({
        grid: grid,
        booked: store.getAllBookings()
    });
});

app.post('/api/book', (req, res) => {
    const { x, y, room, guestName } = req.body;
    
    if (x === undefined || y === undefined || !room || !guestName) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const result = store.book(x, y, room, guestName);
    
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
});

const PORT = 3001;
if (require.main === module) {
    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
}

module.exports = app;