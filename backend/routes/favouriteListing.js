import express from "express";
import { saveFavouriteListingController } from "../controller/favouriteListing/saveFavouriteListingController.js";
import { viewFavouriteListingController } from "../controller/favouriteListing/viewFavouriteListingController.js";
import { searchFavouriteListingController } from "../controller/favouriteListing/searchFavouriteListingController.js"; 




const router = express.Router();


router.post("/", saveFavouriteListingController.saveFavouriteListing);
router.get("/", viewFavouriteListingController.viewFavouriteListing);
router.get("/:id", searchFavouriteListingController.searchFavouriteListing);



export default router;