import { createError } from "../../utils/error.js";
import { ServiceListing } from "../../entity/ServiceListing.js";

export class deleteServiceListingController{
    static async deleteServiceListing(req, res, next){
        try{
            const id = req.params.id;
            const serviceListing = await ServiceListing.suspendServiceListing(id, req.body);

            if(!serviceListing){
                return next(createError(400, "Service Listing Not Found"));
            }
            res.status(200).json({message: "Deleted Successfully"});
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}