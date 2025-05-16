import express from "express";
import { createServiceCategoriesController } from "../controller/serviceCategories/createServiceCategoriesController.js";
import { viewServiceCategoriesController } from "../controller/serviceCategories/viewServiceCategoriesController.js";
import { updateServiceCategoriesController } from "../controller/serviceCategories/updateServiceCategoriesController.js";
import { deleteServiceCategoriesController } from "../controller/serviceCategories/deleteServiceCategoriesController.js";
import { searchServiceCategoriesController } from "../controller/serviceCategories/searchServiceCategoriesController.js";
import { viewServiceCategoriesByIdController } from "../controller/serviceCategories/viewServiceCategoriesByIdController.js";


const router = express.Router();


router.post("/", createServiceCategoriesController.createServiceCategories);
router.get("/", viewServiceCategoriesController.viewServiceCategories);
router.put("/:id", updateServiceCategoriesController.updateServiceCategories);
router.delete("/:id", deleteServiceCategoriesController.deleteServiceCategories);
router.get("/search/:name", searchServiceCategoriesController.searchServiceCategories);
router.get("/:id", viewServiceCategoriesByIdController.viewServiceCategoriesById);

export default router;