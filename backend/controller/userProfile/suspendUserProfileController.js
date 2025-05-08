import { createError } from "../../utils/error.js";
import { UserProfile } from "../../entity/UserProfile.js";

export class suspendUserProfileController{
    static async suspendUserProfile(req, res, next){
        try{
            const id = req.params.id;
            const successs = await UserProfile.suspendUserProfile(id);

            if(!successs){
                return next(createError(400, "User Profile Not Found"));
            }
            res.status(200).json({message: "Suspended Successfully"});
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}