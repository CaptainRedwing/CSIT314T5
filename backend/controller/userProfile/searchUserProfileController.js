import { createError } from "../../utils/error.js";
import { UserProfile } from "../../entity/UserProfile.js";

export class searchUserProfileController{
    static async searchUserProfile(req, res, next){
        try{
            const name = req.params.name;
            console.log(name)
            const userProfile = await UserProfile.searchUserProfile(name);
            console.log(userProfile)
            if(!userProfile){
                return next(createError(400, "User Profile Not Found"));
            }
            res.status(200).json(userProfile);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}