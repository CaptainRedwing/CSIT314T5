import { createError } from "../../utils/error.js";
import { ServiceListing } from "../../entity/ServiceListing.js";

export class updateServiceListingController{
    static async updateServiceListing(req, res, next){
        try{
            const id = req.params.id;
            const serviceListing = await ServiceListing.updateServiceListing(id, req.body);
            if(!serviceListing){
                return res.status(400).json({error: "Service Listing Not Found"});
            }
            res.status(200).json(serviceListing);
        }catch(error){
            console.log(error.message);
            res.status(400).json({error: error.message});
        }
    }
}