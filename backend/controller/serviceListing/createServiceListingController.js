import { createError } from "../../utils/error.js";
import { ServiceListing } from "../../entity/ServiceListing.js";

export class createServiceListingController{
    static async createServiceListing(req, res, next){
        try{
            
            const serviceListing = new ServiceListing(req.body);
            console.log(serviceListing)
            if(!serviceListing.isValid()){
                return res.status(400).json({error: "Invalid user input"});
            }
            const newServiceListing = await serviceListing.createServiceLisitng();
            res.status(201).json(newServiceListing);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}