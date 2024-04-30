import mongoose, { mongo } from 'mongoose'

const BillSchema = mongoose.Schema({
    reservation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true
    },
    service:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true
    }
})