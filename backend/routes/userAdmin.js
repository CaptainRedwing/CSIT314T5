import express from "express";
import { createUserAccount,viewUserAccount,searchUserAccount,updateUserAccount,suspendUserAccount } from "../controller/userAdmin.js";

const router = express.Router();

router.post("/", createUserAccount);


export default router;