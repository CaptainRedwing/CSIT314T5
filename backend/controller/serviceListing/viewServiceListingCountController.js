import { createError } from "../../utils/error.js";
import { ServiceListing } from "../../entity/ServiceListing.js";

export class viewServiceListingCountController{
    static async viewServiceListingCount(req, res, next){
        try{
            const {id} = req.params;
            const updatedViewCount = await ServiceListing.updateAndGetViewCount(id);

            if(updatedViewCount === null){
                return res.status(400).json({message: "Service Listing Not Found"});
            }
            return res.status(200).json({message: "View count updated.", viewCount: updatedViewCount});
        }catch(error){
            console.log("Error updating and fetching view count");
            return res.status(500).json({message: "Internal server error"});
        }
    }
}