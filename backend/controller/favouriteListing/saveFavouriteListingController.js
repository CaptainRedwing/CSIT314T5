import { createError } from "../../utils/error.js";
import { FavouriteListing } from "../../entity/favouriteListing.js";

export class saveFavouriteListingController{
    static async saveFavouriteListing(req, res, next){
        try{
            const favouriteListing = new FavouriteListing(req.body);
            console.log(favouriteListing)

            if(!favouriteListing){
                return res.status(400).json({error:"Invalid favourite listing input"});
            }
            const newFavouriteListing = await favouriteListing.saveFavouriteListing();
            res.status(201).json(newFavouriteListing);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}