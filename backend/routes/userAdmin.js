import express from "express";
import { createUserAccountController } from "../controller/userAccount/createUserAccountController.js";
import { viewUserAccountController } from "../controller/userAccount/viewUserAccountController.js";
import { viewUserAccountByIdController } from "../controller/userAccount/viewUserAccountByIdController.js";
import { searchUserAccountController } from "../controller/userAccount/searchUserAccountController.js";
import { suspendUserAccountController } from "../controller/userAccount/suspendUserAccountController.js";
import { updateUserAccountController } from "../controller/userAccount/updateUserAccountController.js";



const router = express.Router();

router.get("/search", searchUserAccountController.searchUserAccount);
router.get("/", viewUserAccountController.viewUserAccount);
router.post("/", createUserAccountController.createUserAccount);
router.put("/:id", updateUserAccountController.updateUserAccount);
router.get("/:id", viewUserAccountByIdController.viewUserAccountById);
router.delete("/:id", suspendUserAccountController.suspendUserAccount);

export default router;
