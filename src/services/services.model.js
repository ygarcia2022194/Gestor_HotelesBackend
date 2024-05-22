import mongoose from 'mongoose'

const ServiceSchema = mongoose.Schema({
    nameService:{
        type: String,
        required: [true, 'El nombre del servicio es obligatorio']
    },
    description:{
        type: String,
        required: [true, 'La descripcion del servicio es obligatoria']
    },
    typeService:{
        type: String,
        required: [true, 'El tipo de servicio es obligatorio']
    },
    duration:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: [true, 'El precio del servicio es obligatorio']
    },
    /*event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    },*/
    hotel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    /*user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }*/
})

ServiceSchema.methods.toJSON = function(){
    const {__v, _id, ...service} = this.toObject()
    service.uid = _id;
    return service;
}

export default mongoose.model('Service', ServiceSchema)