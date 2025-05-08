import { createError } from "../../utils/error.js";
import { UserProfile } from "../../entity/UserProfile.js";

export class updateUserProfileController{
    static async updateUserProfile(req, res, next){
        try{
            const id = req.params.id;
            const updateUserProfile = await UserProfile.updateUserProfile(id, req.body);
            if(!updateUserProfile){
                return res.status(400).json({error: "User Profile Not Found"});
            }
            res.status(200).json(updateUserProfile);
        }catch(error){
            console.log(error.message);
            res.status(400).json({error: error.message});
        }
    }
}