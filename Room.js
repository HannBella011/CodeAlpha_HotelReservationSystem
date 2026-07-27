class Room {
    constructor(id, number, category, price, available, description) {
        this.id = id;
        this.number = number;
        this.category = category;
        this.price = price;
        this.available = available;
        this.description = description;
    }

    // Check if room is available for booking
    isAvailable() {
        return this.available;
    }

    // Mark room as booked
    book() {
        this.available = false;
    }

    // Mark room as available
    makeAvailable() {
        this.available = true;
    }

    // Get room details
    getDetails() {
        return {
            id: this.id,
            number: this.number,
            category: this.category,
            price: this.price,
            available: this.available,
            description: this.description
        };
    }

    // Convert to JSON for storage
    toJSON() {
        return this.getDetails();
    }

    // Create Room instance from JSON
    static fromJSON(json) {
        return new Room(
            json.id,
            json.number,
            json.category,
            json.price,
            json.available,
            json.description
        );
    }
}

module.exports = Room;
