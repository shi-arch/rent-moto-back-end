const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    vehicleNumber: {
        type: String,
        required: true
    },
    bookingAmount: {
        type: String,
        required: true
    },    
    contact: {
        type: String,
        trim: true
    },
    BookingStartDateAndTime: {
        type: Object
    },
    BookingEndDateAndTime: {
        type: Object
    },
    isBooked: {
        type: Boolean,
        required: true
    },
    vehicleId: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    location: {
        type: String,
        ref: 'location',
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const booking = mongoose.model('booking', bookingSchema);

module.exports = booking;


