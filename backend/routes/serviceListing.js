import express from "express";
import { createServiceListingController } from "../controller/serviceListing/createServiceListingController.js";
import { viewServiceListingController } from "../controller/serviceListing/viewServiceListingController.js";
import { updateServiceListingController } from "../controller/serviceListing/updateServiceListingController.js";
import { suspendServiceListingController } from "../controller/serviceListing/suspendServiceListingController.js";
import { searchServiceListingController } from "../controller/serviceListing/searchServiceListingController.js";


const router =  express.Router();


router.post("/", createServiceListingController.createServiceListing);
router.get("/", viewServiceListingController.viewServiceListing);
router.put("/:id", updateServiceListingController.updateServiceListing);
router.delete("/:id", suspendServiceListingController.suspendServiceListing);
router.get("/:title", searchServiceListingController.searchServiceListing);

export default router;