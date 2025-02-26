import mongoose from "mongoose";

const RoleSchema = mongoose.Schema({
    role: {
        type: String,
        required: [true, 'El rol el obligatorio']
    }
});

export default mongoose.model('role', RoleSchema);