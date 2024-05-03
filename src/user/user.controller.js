import bcryptjs from 'bcryptjs';
import Usuario from '../user/user.model.js'
import { generarJWT } from '../helpers/generate-jwt.js';

export const usuariosGet = async (req = request, res = response) => {
    try {
        const { limite, desde } = req.query;

        const usuario = req.usuario;

        const query = { estado: true };
        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const usuariosPost = async (req, res) => {
    try {
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE_PLAT') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const { nombre, correo, password, role } = req.body;
        const nuevoUsuario = new Usuario({ nombre, correo, password, role });
        const salt = bcryptjs.genSaltSync();
        nuevoUsuario.password = bcryptjs.hashSync(password, salt);
        await nuevoUsuario.save();

        res.status(200).json({ usuario: nuevoUsuario });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = req.usuario;

        const usuarioEncontrado = await Usuario.findOne({ _id: id });

        if (!usuarioEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ usuario: usuarioEncontrado });
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const usuariosPut = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, correo, ...resto } = req.body;

        const usuario = req.usuario;
        if (usuario.role !== 'ADMIN_ROLE_PLAT') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        await Usuario.findByIdAndUpdate(id, resto);

        const usuarioActualizado = await Usuario.findOne({ _id: id });

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({
            msg: 'Usuario actualizado',
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const usuariosDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE_PLAT') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

        if (!usuarioEliminado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ msg: 'Usuario eliminado', usuario: usuarioEliminado });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

