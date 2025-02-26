import { Schema, model } from "mongoose";

const CompanySchema = Schema({
    nameCompany: {
        type: String,
        required: true
    },
    impactLevel: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: String,
        required: true
    },
    businessCategory: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'name in required']
    }
})