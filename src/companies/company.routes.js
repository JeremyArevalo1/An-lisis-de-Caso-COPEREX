import { Router } from "express";
import { check } from "express-validator";
import { getCompanies, getCompanyById, createCompany, updateCompany, generateExcelReport} from "./company.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get(
    "/",
    [
        validarJWT
    ],
    getCompanies
)

router.get(
    "/:id",
    [
        validarJWT,
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

router.get(
    '/report/excel',
    [
        validarJWT
    ],
    generateExcelReport
)

export default router;