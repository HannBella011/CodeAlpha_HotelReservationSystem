const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const Room = require('./models/Room');
const Reservation = require('./models/Reservation');

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Data file paths
const ROOMS_FILE = path.join(__dirname, 'data', 'rooms.json');
const RESERVATIONS_FILE = path.join(__dirname, 'data', 'reservations.json');

// File I/O Operations
function syncRoomAvailability(rooms, reservations) {
    const activeRoomIds = new Set(
        reservations
            .filter(reservation => reservation.isActive())
            .map(reservation => reservation.roomId)
    );

    return rooms.map(room => {
        room.available = !activeRoomIds.has(room.id);
        return room;
    });
}

async function readRooms() {
    try {
        const data = await fs.readFile(ROOMS_FILE, 'utf8');
        const roomsJSON = JSON.parse(data);
        const reservations = await readReservations();
        return syncRoomAvailability(
            roomsJSON.map(roomJSON => Room.fromJSON(roomJSON)),
            reservations
        );
    } catch (error) {
        console.error('Error reading rooms:', error);
        return [];
    }
}

async function writeRooms(rooms) {
    try {
        const roomsJSON = rooms.map(room => room.toJSON());
        await fs.writeFile(ROOMS_FILE, JSON.stringify(roomsJSON, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing rooms:', error);
        return false;
    }
}

async function readReservations() {
    try {
        const data = await fs.readFile(RESERVATIONS_FILE, 'utf8');
        const reservationsJSON = JSON.parse(data);
        return reservationsJSON.map(resJSON => Reservation.fromJSON(resJSON));
    } catch (error) {
        console.error('Error reading reservations:', error);
        return [];
    }
}

async function writeReservations(reservations) {
    try {
        const reservationsJSON = reservations.map(res => res.toJSON());
        await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservationsJSON, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing reservations:', error);
        return false;
    }
}

// API Routes

// Get all rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await readRooms();
        res.json(rooms.map(room => room.toJSON()));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// Get room by ID
app.get('/api/rooms/:id', async (req, res) => {
    try {
        const rooms = await readRooms();
        const room = rooms.find(r => r.id === parseInt(req.params.id));
        if (room) {
            res.json(room.toJSON());
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room' });
    }
});

// Update room availability
app.put('/api/rooms/:id', async (req, res) => {
    try {
        const rooms = await readRooms();
        const roomIndex = rooms.findIndex(r => r.id === parseInt(req.params.id));
        
        if (roomIndex === -1) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const { available } = req.body;
        if (available !== undefined) {
            if (available) {
                rooms[roomIndex].makeAvailable();
            } else {
                rooms[roomIndex].book();
            }
        }

        const success = await writeRooms(rooms);
        if (success) {
            res.json(rooms[roomIndex].toJSON());
        } else {
            res.status(500).json({ error: 'Failed to update room' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update room' });
    }
});

// Get all reservations
app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await readReservations();
        res.json(reservations.map(res => res.toJSON()));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

// Create reservation
app.post('/api/reservations', async (req, res) => {
    try {
        const reservations = await readReservations();
        const rooms = await readRooms();
        const roomId = Number(req.body.roomId);
        
        const roomIndex = rooms.findIndex(r => r.id === roomId);
        if (roomIndex === -1) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const roomAlreadyBooked = reservations.some(reservation => reservation.roomId === roomId && reservation.isActive());
        if (roomAlreadyBooked || !rooms[roomIndex].available) {
            return res.status(409).json({ error: 'This room is already booked for the selected dates.' });
        }

        const newReservation = new Reservation(
            req.body.id,
            req.body.customer,
            roomId,
            req.body.roomNumber,
            req.body.category,
            req.body.checkInDate,
            req.body.checkOutDate,
            req.body.totalPrice,
            req.body.nights,
            req.body.status,
            req.body.paymentStatus,
            req.body.bookingDate
        );

        rooms[roomIndex].book();
        await writeRooms(rooms);

        reservations.push(newReservation);
        const success = await writeReservations(reservations);
        
        if (success) {
            res.status(201).json(newReservation.toJSON());
        } else {
            res.status(500).json({ error: 'Failed to create reservation' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create reservation' });
    }
});

// Cancel reservation
app.put('/api/reservations/:id/cancel', async (req, res) => {
    try {
        const reservations = await readReservations();
        const rooms = await readRooms();
        
        const resIndex = reservations.findIndex(r => r.id === parseInt(req.params.id));
        if (resIndex === -1) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Cancel reservation
        reservations[resIndex].cancel();

        // Make room available again
        const roomIndex = rooms.findIndex(r => r.id === reservations[resIndex].roomId);
        if (roomIndex !== -1) {
            rooms[roomIndex].makeAvailable();
            await writeRooms(rooms);
        }

        const success = await writeReservations(reservations);
        if (success) {
            res.json(reservations[resIndex].toJSON());
        } else {
            res.status(500).json({ error: 'Failed to cancel reservation' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel reservation' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
