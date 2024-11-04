const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    vehicleTableId: {
        type: Schema.Types.ObjectId,
        ref: 'vehicleTable',
        required: true
    }, 
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    BookingStartDateAndTime: {
        type: Object,
        required: true
    },
    BookingEndDateAndTime: {
        type: Object,
        required: true
    },
    extraAddon: {
        type: String
    },
    bookingPrice: {
        type: Object,
        required: true
    },
    discount: {
        type: String
    },
    bookingStatus: {
        enum: ['pending', 'completed', 'canceled'],
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],
        required: true
    },
    rideStatus: {
        enum: ['pending', 'completed', 'canceled'],
        type: String,
        required: true
    },
    pickupLocation: {
        type: Schema.Types.ObjectId,
        ref: 'station',
        required: true
    },
    invoice: {
        type: Schema.Types.ObjectId,
        ref: 'invoice-tbl',
        required: true
    },  
    paymentMethod: {
        type: String,
        enum: ['online', 'cash'],
        required: true
    },
    payInitFrom: {
        type: String,
        required: true
    },
    paySuccessId: {
        type: String,
        required: true
    },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const booking = mongoose.model('booking', bookingSchema);

module.exports = booking;


