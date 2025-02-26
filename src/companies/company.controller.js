import { response, request } from "express";
import Company from "./company.model.js";
import User from "../users/user.model.js";


export const getCompanies = async (req = request, res = response) =>{
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            companies
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener la empresa',
            error
        })
    }
}

export const getCompanyById = async (req, res) => {
    try {
 
        const { id } = req.params;
 
        const companies = await Company.findById(id);
 
        if(!companies){
            return res.status(404).json({
                success: false,
                msg: 'No se encontro la empresa'
            })
        }
 
        res.status(200).json({
            success: true,
            companies
        })
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener la empresa',
            error
        })
    }
}

export const createCompany = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({ name: data.name });

        if (req.usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para agregar empresas.',
            });
        }

        if (!user || user.role == 'ADMIN_ROLE') {
            return res.status(400).json({
                success: false,
                message: 'El cliente no puede ser administrador o no existe el cliente' 
            });
        }

        // Crear la empresa y asociar al cliente con el campo 'clientes'
        const company = new Company({
            ...data,
            clientes: [user._id]  // Asociamos al usuario cliente con su _id
        });

        // Guardar la empresa
        await company.save();

        // Responder con éxito
        return res.status(200).json({
            success: true,
            company
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar la empresa',
            error
        })
    }
}
