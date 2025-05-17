import { createError } from "../../utils/error.js";
import { ServiceListing } from "../../entity/ServiceListing.js";

export class viewServiceListingByIdController{
    static async viewServiceListingById(req, res, next){
        try{
            const id = req.params.id;
            console.log(id)
            const serviceListing = await ServiceListing.viewServiceListingById(id);
            if(!serviceListing){
                return next(createError(400, "Service Listing Not Found"));
            }
            res.status(200).json(serviceListing);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}