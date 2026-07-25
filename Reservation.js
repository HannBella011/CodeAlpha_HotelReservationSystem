class Reservation {
    constructor(id, customer, roomId, roomNumber, category, checkInDate, checkOutDate, totalPrice, nights, status = 'Confirmed', paymentStatus = 'Paid', bookingDate = null) {
        this.id = id;
        this.customer = customer;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.category = category;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.totalPrice = totalPrice;
        this.nights = nights;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.bookingDate = bookingDate || new Date().toISOString().split('T')[0];
    }

    // Cancel reservation
    cancel() {
        this.status = 'Cancelled';
        this.paymentStatus = 'Refunded';
    }

    // Check if reservation is active
    isActive() {
        return this.status === 'Confirmed';
    }

    // Get reservation details
    getDetails() {
        return {
            id: this.id,
            customer: this.customer,
            roomId: this.roomId,
            roomNumber: this.roomNumber,
            category: this.category,
            checkInDate: this.checkInDate,
            checkOutDate: this.checkOutDate,
            totalPrice: this.totalPrice,
            nights: this.nights,
            status: this.status,
            paymentStatus: this.paymentStatus,
            bookingDate: this.bookingDate
        };
    }

    // Convert to JSON for storage
    toJSON() {
        return this.getDetails();
    }

    // Create Reservation instance from JSON
    static fromJSON(json) {
        return new Reservation(
            json.id,
            json.customer,
            json.roomId,
            json.roomNumber,
            json.category,
            json.checkInDate,
            json.checkOutDate,
            json.totalPrice,
            json.nights,
            json.status,
            json.paymentStatus,
            json.bookingDate
        );
    }
}

module.exports = Reservation;
