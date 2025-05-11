import { createError } from "../../utils/error.js";
import { FavouriteListing } from "../../entity/favouriteListing.js";

export class searchFavouriteListingController{
    static async searchFavouriteListing(req, res, next){
        try{
            const id = req.params.id;
            const favouriteListing = await FavouriteListing.searchFavouriteListing(id);
            if(!favouriteListing){
                return next(createError(400, "Favourite Listing Not Found"));
            }
            res.status(200).json(favouriteListing);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}