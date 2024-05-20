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
    imgUrl: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }
});


export default mongoose.model('Hotel', HotelSchema)