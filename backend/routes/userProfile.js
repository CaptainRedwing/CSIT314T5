import express from "express";
import { createUserProfileController } from "../controller/userProfile/createUserProfileController.js";
import { viewUserProfileController } from "../controller/userProfile/viewUserProfileController.js";
import { updateUserProfileController } from "../controller/userProfile/updateUserProfileController.js";
import { suspendUserProfileController } from "../controller/userProfile/suspendUserProfileController.js";
import { searchUserProfileController } from "../controller/userProfile/searchUserProfileController.js";


const router = express.Router();


router.post("/", createUserProfileController.createUserProfile);
router.get("/", viewUserProfileController.viewUserProfile);
router.put("/:id", updateUserProfileController.updateUserProfile);
router.put("/:id", suspendUserProfileController.suspendUserProfile);
router.get("/:name", searchUserProfileController.searchUserProfile);

export default router;