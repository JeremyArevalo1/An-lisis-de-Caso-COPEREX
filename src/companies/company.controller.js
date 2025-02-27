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
        const user = await User.find({ name: { $in: data.clientes }});
        const empresaExistente = await Company.findOne({ $or: [{email: data.email }, { nameCompany: data.nameCompany }]});

        if (empresaExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe esta empresa(email y nombre. (de la empresa))'
            });
        }

        if (req.usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para agregar empresas.',
            });
        }

        const clientesValidos = user.filter(user => user.role !== 'ADMIN_ROLE');

        if (clientesValidos.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No hay clientes válidos para agregar a la empresa.',
            });
        }

        const company = new Company({
            ...data,
            clientes: clientesValidos.map(user => user._id)
        });

        await company.save();

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

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, nameCompany, email, ...data } = req.body;

        const company = await Company.findById(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada',
            });
        }

        if (req.usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para editar empresas.',
            });
        }

        const empresaExistente = await Company.findOne({
            $or: [{ email: data.email }, { nameCompany: data.nameCompany }]
        });

        if (empresaExistente && empresaExistente._id.toString() !== id) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una empresa con el mismo nombre o email.',
            });
        }

        const users = await User.find({ name: { $in: data.clientes } });
        const clientesValidos = users.filter(user => user.role !== 'ADMIN_ROLE');

        if (clientesValidos.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No hay clientes válidos para agregar a la empresa.',
            });
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            id,
            {
                ...data,
                clientes: clientesValidos.map(user => user._id)
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            msg: 'Empresa actualizada',
            company: updatedCompany
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la empresa',
            error
        });
    }
};