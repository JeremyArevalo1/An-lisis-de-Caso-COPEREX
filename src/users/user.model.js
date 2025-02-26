import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'name in required'],
        maxLength: [25, 'cant be  overcome 25 characters']
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Emial is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE'],
        default: null
    },
    estado: {
        type: Boolean,
        default: true
    }
},

    {
        timestamps: true,
        versionKey: false
    }

);

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('user', UserSchema);