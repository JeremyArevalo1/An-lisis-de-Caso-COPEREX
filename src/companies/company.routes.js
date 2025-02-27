import { Router } from "express";
import { check } from "express-validator";
import { getCompanies, getCompanyById, createCompany, updateCompany } from "./company.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get(
    "/",
    getCompanies
)

router.get(
    "/:id",
    [
        check("id", "no es un id valido"),
        validarCampos
    ],
    getCompanyById
)

router.post(
    "/",
    [
        validarJWT,
        check('email', 'Este no es un correo valido').not().isEmpty(),
        validarCampos
    ],
    createCompany
)

router.put(
    '/:id',
    [
        validarJWT,
        check("id", "No es un id válido").isMongoId(),
        validarCampos
    ],
    updateCompany
);

export default router;