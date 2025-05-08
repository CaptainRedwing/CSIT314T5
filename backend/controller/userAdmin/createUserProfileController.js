import { createError } from "../../utils/error.js";
import { UserProfile } from "../../entity/UserProfile.js";

export class createUserProfileController{
    static async createUserProfile(req, res, next){
        try{
            const userProfile = new UserProfile(req.body);

            if(!userProfile.isValid()){
                return res.status(400).json({error: "Invalid user profile input"})
            }
            const newUserProfile = await userProfile.createUserProfile();
            res.status(201).json(newUserProfile);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}