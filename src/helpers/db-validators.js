//import Role from '../roles/role.model.js';
import User from '../user/user.model.js';
import Hotel from '../hotel/hotel.model.js';
import Events from '../events/events.model.js';
import Room from '../room/room.model.js';
import Reservation from '../reservation/reservation.model.js';

// export const checkRole = async (req, res, next) => {
//     try {
//         const { role } = req.body; // Asumiendo que el rol se pasa en el cuerpo de la solicitud

//         // Verificar si el rol existe en la base de datos
//         const foundRole = await Role.findOne({ name: role });

//         if (!foundRole) {
//             return res.status(403).json({ error: `El rol '${role}' no existe en la base de datos.` });
//         }

//         next(); // Llama a next() para pasar al siguiente middleware o ruta
//     } catch (error) {
//         console.error('Error en el middleware de verificación de roles:', error);
//         return res.status(500).json({ error: 'Error interno del servidor' });
//     }
// };



export const existenteEmail = async (correo = '') => {
  const existeEmail = await User.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El email ${correo} ya fue registrado`);
  }
}

export const validarRol = async (role = '') => {
  try {
    // Roles permitidos
    const rolesPermitidos = ["ADMIN_ROLE_PLAT", "USER_ROLE", "ADMIN_ROLE_HOTEL"];

    // Verifica si el rol proporcionado está en la lista de roles permitidos
    if (!rolesPermitidos.includes(role)) {
      throw new Error(`El rol ${role} no es válido. Los roles permitidos son: ${rolesPermitidos.join(', ')}`);
    }

    // Si el rol es válido, la validación pasa
    return true;
  } catch (error) {
    // Manejo de errores, podrías imprimir o registrar el error
    console.error('Error al verificar el rol:', error);
    // Devuelve false en caso de error para indicar que la validación falló
    return false;
  }
};



export const existeUsuarioById = async (id = '') => {
  const existeUsuario = await User.findById(id);
  if (!existeUsuario) {
    throw new Error(`El ID: ${correo} No existe`);
  }
}

// ------------------- Hotel
export const existeHotelById = async (id = '') => {
  try {
    const existeHotel = await Hotel.findById(id);
    if (!existeHotel) {
      throw new Error(`El hotel con ID: ${id} no existe`);
    }
  } catch (error) {
    throw new Error(`Error al buscar el hotel por ID: ${error.message}`);
  }
};

export const existenteNombreHotel = async (nombreHotel = '') => {
  try {
    const existeNombreHotel = await Hotel.findOne({ nameHotel: nombreHotel });
    if (existeNombreHotel) {
      throw new Error(`El nombre del hotel "${nombreHotel}" ya está registrado`);
    }
  } catch (error) {
    throw new Error(`Error al verificar el nombre del hotel: ${error.message}`);
  }
};


// ----------- ROOM


//--------------EVENTS
export const existeEventById = async (id = '') => {
  try {
    const existeEvento = await Events.findById(id);
    if (!existeEvento) {
      throw new Error(`El evento con ID: ${id} no existe`);
    }
  } catch (error) {
    throw new Error(`Error al buscar el evento por ID: ${error.message}`);
  }
};

export const validarNumeroHuespedes = (huespedes) => {
  if (!Number.isInteger(huespedes) || huespedes <= 0) {
      throw new Error('Número de huéspedes debe ser un número entero positivo');
  }
}

export const validarFechar = async (fechaInicio, fechaFin) => {
  if (fechaInicio >= fechaFin) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
  }
};

export const validarCapacidad = async (habitacionId, numeroHuespedes) => {
  const habitacion = await Room.findById(habitacionId);
  if (!habitacion) {
      throw new Error('La habitación no existe');
  }

  if (numeroHuespedes > habitacion.capacidad) {
      throw new Error('El número de huéspedes excede la capacidad de la habitación');
  }
};

export const validarDisponibilidad = async (habitacionId, fechaInicio, fechaFin) => {
  const reservaciones = await Reservation.find({
      room: habitacionId,
      $or: [
          { dateStart: { $lte: fechaInicio }, dateFinish: { $gte: fechaInicio } },
          { dateStart: { $lte: fechaFin }, dateFinish: { $gte: fechaFin } },
          { dateStart: { $gte: fechaInicio }, dateFinish: { $lte: fechaFin } }
      ]
  });

  if (reservaciones.length > 0) {
      throw new Error('La habitación no está disponible para las fechas solicitadas');
  }
};

export const existeReservacionById = async (id = '') => {
  const existeReservacion = await Reservation.findById(id);
  if (!existeReservacion) {
      throw new Error(`El ID: ${id} No existe`);
  }
}