import bcryptjs from 'bcryptjs';
import Usuario from '../user/user.model.js'
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    console.log("entro a login")
    const { correo, password } = req.body;

    console.log(correo, password, "data recibida en backend");

    try {
        //verificar si el email existe:
        const user = await Usuario.findOne({ correo: correo.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {
            const token = await generarJWT(user.id, user.correo)

            res.status(200).json({
                msg: "Login Ok!!!",
                userDetails: {
                    username: user.nombre,
                    token: token
                },
            });
        }

        if (!user) {
            return res
                .status(400)
                .send(`Wrong credentials, ${correo} doesn't exists en database`);
        }

        // verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).send("wrong password");
        }

    } catch (e) {
        res.status(500).send("Comuniquese con el administrador");
    }
};

// ---------Usuarios Normales

export const signUp = async (req, res) => {
console.log("entro a signup")
    const { correo, nombre, password } = req.body;
    console.log(nombre, "nombre", correo, "correo", password, "password");
    const usuario = new Usuario({ nombre, correo, password });


    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.status(200).json({
        usuario
    });
}


// Eliminar cuenta propia de usuarios
export const usuariosDeleteClientes = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = req.usuario;

        if (usuario.role !== 'USER_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const usuarioEliminar = await Usuario.findById(id);
        if (!usuarioEliminar) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (usuario.correo !== usuarioEliminar.correo) {
            return res.status(403).json({ error: 'Acceso denegado. No tiene permisos para eliminar este usuario.' });
        }

        if (usuarioEliminar.estado === false) {
            return res.status(400).json({ error: 'El usuario ya está desactivado.' });
        }

        const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

        if (!usuarioEliminado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ msg: 'El usuario estaba activo y ahora ha sido desactivado.', usuario: usuarioEliminado });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

/*
export const usuariosDeleteClientes = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = req.usuario;

        if (usuario.role !== 'CLIENT_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const usuarioEliminar = await Usuario.findById(id);
        if (!usuarioEliminar) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (usuario.correo !== usuarioEliminar.correo) {
            return res.status(403).json({ error: 'Acceso denegado. No tiene permisos para eliminar este usuario.' });
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

export const usuarioPropioPut = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, google, correo, ...resto } = req.body;

        const usuario = req.usuario;

        if (usuario.role !== 'CLIENT_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const usuarioActualizar = await Usuario.findById(id);
        if (!usuarioActualizar) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (usuario.correo !== usuarioActualizar.correo) {
            return res.status(403).json({ error: 'Acceso denegado. No tiene permisos para actualizar este usuario.' });
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
 */
