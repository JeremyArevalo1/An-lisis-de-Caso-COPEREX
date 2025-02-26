import { Router } from "express";
import { loginAdmin, registerAdmin, loginCustomers, registerCustomers } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/validator.js";
import { deleteFileOnError } from "../middlewares/deleteFileOnError.js";
import { validarJWT } from "../middlewares/validar-jwt.js";


const router = Router();

router.post(
    '/loginAdministrador',
    loginValidator,
    deleteFileOnError,
    loginAdmin
);

router.post(
    '/registerAdministrador',
    registerValidator,
    deleteFileOnError,
    registerAdmin
);


router.post(
    '/loginClientes',
    loginValidator,
    deleteFileOnError,
    loginCustomers
);

router.post(
    '/registerClientes',
    registerValidator,
    validarJWT,
    deleteFileOnError,
    registerCustomers
);

export default router;