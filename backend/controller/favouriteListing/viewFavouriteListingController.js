import { createError } from "../../utils/error.js";
import { FavouriteListing } from "../../entity/favouriteListing.js";

export class viewFavouriteListingController{
    static async viewFavouriteListing(req, res, next){
        try{
            const favouriteListing = await FavouriteListing.viewFavouriteListing();
            res.status(200).json(favouriteListing);
        }catch(error){
            console.log(error.message);
            return next(createError(400, "No favourite listing has been created"))
        }
    }
}