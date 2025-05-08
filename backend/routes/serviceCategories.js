import express from "express";
import { createServiceCategoriesController } from "../controller/serviceCategories/createServiceCategoriesController.js";
import { viewServiceCategoriesController } from "../controller/serviceCategories/viewServiceCategoriesController.js";
import { updateServiceCategoriesController } from "../controller/serviceCategories/updateServiceCategoriesController.js";
import { deleteServiceCategoriesController } from "../controller/serviceCategories/deleteServiceCategoriesController.js";
import { searchServiceCategoriesController } from "../controller/serviceCategories/searchServiceCategoriesController.js";


const router = express.Router();


router.post("/", createServiceCategoriesController.createServiceCategories);
router.get("/", viewServiceCategoriesController.viewServiceCategories);
router.put("/:id", updateServiceCategoriesController.updateServiceCategories);
router.delete("/:id", deleteServiceCategoriesController.deleteServiceCategories);
router.get("/:name", searchServiceCategoriesController.searchServiceCategories);

export default router;