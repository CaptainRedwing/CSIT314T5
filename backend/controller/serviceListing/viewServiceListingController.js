import { createError } from "../../utils/error.js";
import { ServiceListing } from "../../entity/ServiceListing.js";

export class viewServiceListingController{
    static async viewServiceListing(req, res, next){
        try{
            const serviceListing = await ServiceListing.viewServiceListing();
            res.status(200).json(serviceListing);
        }catch(error){
            console.log(error.message);
            return next(createError(400, "No Service Listing Fonud"));
        }
    }
}