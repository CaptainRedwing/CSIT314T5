import { createError } from "../../utils/error.js";
import { ServiceListing } from "../../entity/ServiceListing.js";

export class shortListedCountController{
    static async shortListedCount(req, res, next){
        try{
            const {id} = req.params;
            const updatedListedCount = await ServiceListing.updateAndGetListedCount(id);
            if(updatedListedCount === null){
                return res.status(400).json({message: "Service Listing Not Found"});
            }
            return res.status(200).json({message: "Short listed count updated"})
        }catch(error){
            console.log("Error updating and fetching short listed count");
            return res.status(500).json({message: "Internal Server error"});
        }
    }
}