import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    email: {
        type: String,
        required: [true, "El correo es obligarorio"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligaroria"],
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN_ROLE_PLAT", "USER_ROLE", "ADMIN_ROLE_HOTEL"],
        default: "USER_ROLE",
    },
    status: {
        type: Boolean,
        default: true,
    },
});

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}   

export default mongoose.model('User', UserSchema);