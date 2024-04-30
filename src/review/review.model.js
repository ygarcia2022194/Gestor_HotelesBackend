import mongoose from 'mongoose'

const ReviewSchema = mongoose.Schema({
    comment:{
        type: String,
        required: [true, 'El comentario de la opinion es obligatoria']
    },
    raitingClean:{
        type: Number,
        required: [true, 'El raiting de la limpieza es obligatioria']
    },
    raitingStaff:{
        type: Number,
        required: [true, 'El raiting del personal es obligatorio']
    },
    raitingAttention:{
        type: Number,
        required: [true, 'El raiting de la atencion al cliente es obligatorio']
    },
    status:{
        type: Boolean,
        default: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    }
})

ReviewSchema.methods.toJSON = function(){
    const {__v, _id, ...review} = this.ObjectId();
    review.uid = _id;
    return review;
}

export default mongoose.model('Review', ReviewSchema);