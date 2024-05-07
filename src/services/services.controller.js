import Service from '../services/services.model.js';

export const servicePost = async (req, res) =>{
    try {
        const service = req.service;

        const{
            nameService,
            description,
            typeService,
            duration,
            price,
            hotelId,
            userId
        } = req.body;

        const newService = new Service({
            nameService,
            description,
            typeService,
            duration,
            price,
            hotel: hotelId,
            user: userId 
        })

        await newService.save();
        res.status(200).json({service: newService})
    } catch (error){
        console.log('Error al crear habitacion:', error)
        res.status(500).json({error: 'error interno del servidor'})
        
    }
}

export const getService = async (req, res) =>{
    const {limite, desde} = req.query;
    const query = {estado: true};

    try {
        const [total, service] = await Promise.all([
            Service.countDocuments(query),
            Service.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ])
    } catch (error) {
        console.log('Error al obtener servicios', error)
        res.status(500).json({error: 'Error interno del servidor'})
    }
}