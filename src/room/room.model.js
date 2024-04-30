import mongoose from 'mongoose'

const RoomSchema = mongoose.Schema({
    description: {
        type: String,
        required: [true, "La descripcion de la habitacion es obligatoria"]
    },
    peopleCapacity: {
        type: String,
        required: [true, "La capacidad de personas para la habitacion es obligatoria"]
    },
    priceRoom: {
        type: String,
        required: [true, "El precio de la habitacion es obligatoria"]
    },
    typeRoom: {
        type: String,
        required: [true, "El tipo de habitacion es obligatoria"]
    },
    status: {
        type: String,
        enum: ["DESOCUPADA", "OCUPADA"],
        default: "DESOCUPADA"
    },
    hotel:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Hotel',
       required: true 
    },
    reservation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation'
    }
})

RoomSchema.methods.toJSON = function(){
    const {__v, _id, ...room} = this.ObjectId()
    room.uid = _id;
    return room;
}

export default mongoose.model('Room', RoomSchema);