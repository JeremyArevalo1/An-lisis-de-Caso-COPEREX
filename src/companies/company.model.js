import { Schema, model } from "mongoose";

const CompanySchema = Schema({
    nameCompany: {
        type: String,
        required: [true, 'name company is required']
    },
    impactLevel: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: String,
        required: [true, 'years of experience is required']
    },
    businessCategory: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: [true, 'phone is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    clientes: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
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

export default model('company', CompanySchema);