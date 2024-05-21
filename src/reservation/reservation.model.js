import mongoose from 'mongoose'

const ReservationSchema = mongoose.Schema({
    dateStart:{
        type: Date,
        required: true
    },
    dateFinish:{
        type: Date,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    },
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    huespedes:{
        type: Number,
        required: true
    }
    /*user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }*/
});

ReservationSchema.methods.toJSON = function(){
    const {__v, _id, ...reservation} = this.toObject();
    reservation.uid = _id;
    return reservation;
}

export default mongoose.model('Reservation', ReservationSchema);