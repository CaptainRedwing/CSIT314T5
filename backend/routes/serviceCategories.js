import express from "express";
import { createServiceCategoriesController } from "../controller/createServiceCategoriesController.js";
import { viewServiceCategoriesController } from "../controller/viewServiceCategoriesController.js";
import { updateServiceCategoriesController } from "../controller/updateServiceCategoriesController.js";
import { deleteServiceCategoriesController } from "../controller/deleteServiceCategoriesController.js";
import { searchServiceCategoriesController } from "../controller/searchServiceCategoriesController.js";


const router = express.Router();


router.post("/", createServiceCategoriesController.createServiceCategories);
router.get("/", viewServiceCategoriesController.viewServiceCategories);
router.put("/:id", updateServiceCategoriesController.updateServiceCategories);
router.delete("/:id", deleteServiceCategoriesController.deleteServiceCategories);
router.get("/:id", searchServiceCategoriesController.searchServiceCategories);

export default router;