import { createError } from "../../utils/error.js";
import { ServiceListing } from "../../entity/ServiceListing.js";

export class searchServiceListingController{
    static async searchServiceListing(req, res, next){
        try{
            const id = req.params.id;
            const serviceListing = await ServiceListing.searchServiceListing(id);
            if(!serviceListing){
                return next(createError(400, "Service Listing Not Found"));
            }
            res.status(200).json(serviceListing)
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}