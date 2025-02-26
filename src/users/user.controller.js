import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";



export const getUsers = async (req = request, res = response) =>{
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuario',
            error
        })
    }
};

export const getUserById = async (req, res) => {
    try {
 
        const { id } = req.params;
 
        const user = await User.findById(id);
 
        if(!user){
            return res.status(404).json({
                success: false,
                msg: 'Usuario not found'
            })
        }
 
        res.status(200).json({
            success: true,
            user
        })
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
};

export const updateAdmin = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, email, role, ...data } = req.body;

        const buscarUser = await User.findById(id);

        if (!buscarUser) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            });
        }

        if (buscarUser.role !== 'ADMIN_ROLE') {
            return res.status(400).json({
                success: false,
                msg: 'Este ID no pertenece a un administrador'
            });
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Administrador actualizado',
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar administrador',
            error
        });
    }
};

export const updateCustomers = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, email, role, ...data } = req.body;

        const buscarUser = await User.findById(id);

        if (!buscarUser) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            });
        }

        if (buscarUser.role === 'ADMIN_ROLE') {
            return res.status(400).json({
                success: false,
                msg: 'Este ID no pertenece a un cliente'
            });
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Cliente actualizado',
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el Cliente',
            error
        });
    }
};