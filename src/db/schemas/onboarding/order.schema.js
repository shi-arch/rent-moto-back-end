const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderId: { //
        type: String,
        unique: true,
        required: true
    },
    vehicleNumber: { //
        type: String,
        required: true
    },
    vehicleImage: { //
        type: String,
        required: true
    },
    vehicleName: { //
        type: String,
        required: true
    },
    endDate: { //
        type: String,
        required: true
    },
    endTime: { //
        type: String,
        required: true
    },
    startDate: { //
        type: String,
        required: true
    },
    startTime: { //
        type: String,
        required: true
    },
    location: { //
        type: String,
        required: true
    },
    pickupLocation: { //
        type: String,
        required: true
    },
    paymentStatus: { //
        enum: ['pending', 'completed', 'canceled'],
        type: String,
        required: true
    },
    paymentMethod: { //
        enum: ['cash', 'card', 'upi', 'wallet'],
        type: String,
        required: true
    },
    userId: { //
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    email: { //
        type: String,
        required: true
    },
    contact: { //
        type: String,
        required: true
    },
    submittedDocument: { //
        type: String,
        required: true
    }
    
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const order = mongoose.model('order', orderSchema);

module.exports = order;


