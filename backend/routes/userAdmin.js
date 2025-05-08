import express from "express";
import { createUserAccountController } from "../controller/userAdmin/createUserAccount.js";
import { viewUserAccountController } from "../controller/userAdmin/viewUserAccountController.js";
import { viewAccountByUserNameRoleController } from "../controller/userAdmin/viewAccountByUserNameRoleController.js";
import { findSpecificUserAccountController } from "../controller/userAdmin/findSpecificUserAccountController.js";
import { suspendUserAccountController } from "../controller/userAdmin/suspendUserAccountController.js";
import { updateUserAccountController } from "../controller/userAdmin/updateUserAccountController.js";



const router = express.Router();

router.get("/search", viewAccountByUserNameRoleController.viewAccountByUserNameRole);
router.get("/", viewUserAccountController.viewUserAccount);
router.post("/", createUserAccountController.createUserAccount);
router.put("/:id", updateUserAccountController.updateUserAccount);
router.get("/:id", findSpecificUserAccountController.findSpecificUserAccount);
router.delete("/:id", suspendUserAccountController.suspendUserAccount);

export default router;
