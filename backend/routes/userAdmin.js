import express from "express";
import {createUserAccount,
        viewUserAccount,
        updateUserAccount,
        suspendUserAccount,
        findSpecificUserAccount} from "../controller/userAdmin.js";

const router = express.Router();

router.get("/", viewUserAccount);
router.post("/", createUserAccount);
router.put("/:id", updateUserAccount);
router.get("/:id", findSpecificUserAccount);
router.delete("/:id", suspendUserAccount);

export default router;