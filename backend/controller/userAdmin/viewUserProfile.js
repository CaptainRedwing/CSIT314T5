import { createError } from "../../utils/error.js";
import { UserProfile } from "../../entity/UserProfile.js";

export class viewUserProfileController{
    static async viewUserProfile(req, res, next){
        try{
            const userProfile = await UserProfile.viewUserProfile();
            res.status(200).json(userProfile);
        }catch(error){
            console.log(error.message);
            return next(createError(400, "No User Profile has been created"));
        }
    }
}