import express from "express";
import { createUserProfileController } from "../controller/createUserProfileController.js";
import { viewUserProfileController } from "../controller/viewUserProfile.js";
import { updateUserProfileController } from "../controller/updateUserProfileController.js";
import { suspendUserProfileController } from "../controller/suspendUserProfileController.js";
import { searchUserProfileController } from "../controller/searchUserProfileController.js";


const router = express.Router();


router.post("/", createUserProfileController.createUserProfile);
router.get("/", viewUserProfileController.viewUserProfile);
router.put("/:id", updateUserProfileController.updateUserProfile);
router.delete("/:id", suspendUserProfileController.suspendUserProfile);
router.get("/:id", searchUserProfileController.searchUserProfile);

export default router;