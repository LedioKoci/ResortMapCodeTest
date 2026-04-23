const request = require('supertest');
const app = require('./index');
const BookingStore = require('./bookingStore');

describe('Backend API & Booking Logic', () => {
    let store;

    // We can unit test the store logic directly
    describe('BookingStore Logic', () => {
        beforeEach(() => {
            // Point to the actual bookings.json for test validation
            store = new BookingStore('../bookings.json'); 
        });

        test('Validates existing guest successfully', () => {
            expect(store.isValidGuest('101', 'Alice Smith')).toBe(true);
        });

        test('Fails validation for incorrect guest/room combo', () => {
            expect(store.isValidGuest('101', 'Bob Jones')).toBe(false);
            expect(store.isValidGuest('999', 'Ghost')).toBe(false);
        });

        test('Successfully books an available cabana', () => {
            const result = store.book(5, 5, '101', 'Alice Smith');
            expect(result.success).toBe(true);
            expect(store.isBooked(5, 5)).toBe(true);
        });

        test('Prevents double-booking a cabana', () => {
            store.book(5, 5, '101', 'Alice Smith');
            const duplicateResult = store.book(5, 5, '102', 'Bob Jones');
            expect(duplicateResult.success).toBe(false);
            expect(duplicateResult.message).toMatch(/already booked/i);
        });
    });

    // We can integration test the REST endpoints
    describe('REST API Endpoints', () => {
        test('GET /api/map returns grid and bookings array', async () => {
            const res = await request(app).get('/api/map');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('grid');
            expect(res.body).toHaveProperty('booked');
            expect(Array.isArray(res.body.grid)).toBe(true);
        });

        test('POST /api/book fails with missing fields', async () => {
            const res = await request(app).post('/api/book').send({
                x: 2, y: 2 // Missing room and name
            });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});