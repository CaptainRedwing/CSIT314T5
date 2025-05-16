import { createError } from "../../utils/error.js";
import { UserProfile } from "../../entity/UserProfile.js";

export class viewSpecifyByIdController{
    static async viewSpecifyById(req, res, next){
        try{
            const id = req.params.id;
            const userProfile = await UserProfile.viewSpecifyById(id);
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