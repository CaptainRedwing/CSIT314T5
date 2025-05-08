import express from "express";
import { createUserProfileController } from "../controller/userAdmin/createUserProfileController.js";
import { viewUserProfileController } from "../controller/userAdmin/viewUserProfile.js";
import { updateUserProfileController } from "../controller/userAdmin/updateUserProfileController.js";
import { suspendUserProfileController } from "../controller/userAdmin/suspendUserProfileController.js";
import { searchUserProfileController } from "../controller/userAdmin/searchUserProfileController.js";


const router = express.Router();


router.post("/", createUserProfileController.createUserProfile);
router.get("/", viewUserProfileController.viewUserProfile);
router.put("/:id", updateUserProfileController.updateUserProfile);
router.delete("/:id", suspendUserProfileController.suspendUserProfile);
router.get("/:name", searchUserProfileController.searchUserProfile);

export default router;