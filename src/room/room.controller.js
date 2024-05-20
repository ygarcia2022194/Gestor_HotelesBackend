import Room from '../room/room.model.js';

export const roomPost = async (req, res) => {
    try {
        const usuario = req.usuario;

        // Verificar si el usuario tiene permisos de administrador
        if (usuario.role !== 'ADMIN_ROLE_HOTEL') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const { description, peopleCapacity, priceRoom, typeRoom, hotelId } = req.body;

        // Crear una nueva instancia de la habitación
        const nuevaHabitacion = new Room({
            description,
            peopleCapacity,
            priceRoom,
            typeRoom,
            hotel: hotelId // Asignar el ID del hotel al que pertenece esta habitación
        });

        // Guardar la nueva habitación en la base de datos
        await nuevaHabitacion.save();

        // Devolver la habitación recién creada como respuesta
        res.status(200).json({ room: nuevaHabitacion });
    } catch (error) {
        console.error('Error al crear habitación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getRooms = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const [total, rooms] = await Promise.all([
            Room.countDocuments(query),
            Room.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            rooms
        });
    } catch (error) {
        console.error('Error al obtener habitaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const roomPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, google, correo, ...resto } = req.body;

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE_HOTEL') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        await Room.findByIdAndUpdate(id, resto);

        const roomActualizada = await Room.findOne({ _id: id });

        if (!roomActualizada) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        res.status(200).json({
            msg: 'Habitación actualizada',
            room: roomActualizada
        });
    } catch (error) {
        console.error('Error al actualizar habitación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const roomDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE_HOTEL') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const roomEliminada = await Room.findByIdAndUpdate(id, { estado: false });

        if (!roomEliminada) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        res.status(200).json({ msg: 'Habitación eliminada', room: roomEliminada });
    } catch (error) {
        console.error('Error al eliminar habitación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = req.usuario;

        const roomEncontrada = await Room.findOne({ _id: id });

        if (!roomEncontrada) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        res.status(200).json({ room: roomEncontrada });
    } catch (error) {
        console.error('Error al obtener habitación por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getRoomsByHotel = async (req, res) => {
    console.log(req.params)
    const { name } = req.params;
    console.log(name)
    try {
        const rooms = await Room.find({ hotel: name }).populate('hotel');
        res.status(200).json({ rooms });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
