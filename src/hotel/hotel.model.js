import mongoose from 'mongoose'

const HotelSchema = mongoose.Schema({
    nameHotel:{
        type: String,
        required: [true, "El nombre del hotel es obligatorio"]
    },
    address: {
        type: String,
        required: [true, "La direccion del hotel es obligatioria"]
    },
    description: {
        type: String,
        required: [true, "La descripcion es olbligatoria"]
    },
    status: {
        type: Boolean,
        default: true
    }
});

HotelSchema.methods.toJSON = function (){
    const {__v, _id, ...hotel} = this.toObject(); 
    hotel.uid = _id;
    return hotel;
};

export default mongoose.model('Hotel', HotelSchema)