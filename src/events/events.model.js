import mongoose from 'mongoose'

const EventsSchema = mongoose.Schema({
    nameEvent:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    dateEvent:{
        type: Date,
        required: true
    },
    hotel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
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
    estado: {
        type: Boolean,
        default: true,
    },
})

EventsSchema.methods.toJSON = function(){
    const {__v, _id, ...events} = this.toObject()
    events.uid = _id;
    return events
}

export default mongoose.model('Events', EventsSchema);