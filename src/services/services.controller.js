import Service from '../services/services.model.js';

// Crear un nuevo servicio
export const createService = async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los servicios
export const getServices = async (req, res) => {
    const service = await Service.find();
    res.json({
        service
    });
};

// Obtener un servicio por ID
export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('hotel').populate('user');
        if (!service) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un servicio
export const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!service) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};