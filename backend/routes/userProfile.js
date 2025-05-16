import express from "express";
import { createUserProfileController } from "../controller/userProfile/createUserProfileController.js";
import { viewUserProfileController } from "../controller/userProfile/viewUserProfileController.js";
import { updateUserProfileController } from "../controller/userProfile/updateUserProfileController.js";
import { suspendUserProfileController } from "../controller/userProfile/suspendUserProfileController.js";
import { searchUserProfileController } from "../controller/userProfile/searchUserProfileController.js";
import { viewSpecifyByIdController } from "../controller/userProfile/viewSpecifyById.js";


const router = express.Router();


router.post("/", createUserProfileController.createUserProfile);
router.get("/", viewUserProfileController.viewUserProfile);
router.get("/:id", viewSpecifyByIdController.viewSpecifyById);
router.put("/:id", updateUserProfileController.updateUserProfile);
router.delete("/:id", suspendUserProfileController.suspendUserProfile);
router.get("/search/:name", searchUserProfileController.searchUserProfile);


export default router;