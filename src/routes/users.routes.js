import { Router } from "express";
import { checkRoles, checkUserAuthenticated } from "../middlewares/auth.js";
import { modifyRole } from "../controllers/users.controller.js";
import { uploadUserDoc } from "../utils.js";
import { uploadDocumentsControl } from "../controllers/users.controller.js";

const router = Router();

router.put("/premium/:uid", checkUserAuthenticated, checkRoles(["admin"]), modifyRole);

router.post("/:uid/documents", checkUserAuthenticated, uploadUserDoc.fields([{name:"identificacion", maxCount: 1}, {name:"domicilio", maxCount: 1}, {name:"estadoDeCuenta", maxCount: 1}]), uploadDocumentsControl);

export {router as usersRouter};