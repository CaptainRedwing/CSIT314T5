import express from "express";
import { createServiceListingController } from "../controller/serviceListing/createServiceListingController.js";
import { viewServiceListingController } from "../controller/serviceListing/viewServiceListingController.js";
import { updateServiceListingController } from "../controller/serviceListing/updateServiceListingController.js";
import { deleteServiceListingController } from "../controller/serviceListing/deleteServiceListingController.js";
import { searchServiceListingController } from "../controller/serviceListing/searchServiceListingController.js";
import { viewServiceListingCountController } from "../controller/serviceListing/viewServiceListingCountController.js";
import { shortListedCountController } from "../controller/serviceListing/shortListedCountController.js";
import { viewServiceListingByIdController } from "../controller/serviceListing/viewServiceListingByIdController.js";

const router =  express.Router();


router.post("/", createServiceListingController.createServiceListing);
router.get("/", viewServiceListingController.viewServiceListing);
router.put("/:id", updateServiceListingController.updateServiceListing);
router.delete("/:id", deleteServiceListingController.deleteServiceListing);
router.get("/search/:title", searchServiceListingController.searchServiceListing);
router.get("/:id", viewServiceListingByIdController.viewServiceListingById);
router.post("/service-listing/:id/view", viewServiceListingCountController.viewServiceListingCount);
router.post("/service-listing/:id/short-listed", shortListedCountController.shortListedCount);

export default router;