//import Role from '../roles/role.model.js';
import User from '../user/user.model.js';


/*
export const esRoleValido = async (role = '') => {
    const existeRol = await Role.findOne({role});
    if (!existeRol){
        throw new Error(`El role ${role} no existe en la base datos`);
    }
}*/

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
    const existeEmail = await User.findOne({correo});
    if (existeEmail){
        throw new Error(`El email ${correo} ya fue registrado`);
    }
}


export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    if (!existeUsuario){
        throw new Error(`El ID: ${correo} No existe`);
    }
}

