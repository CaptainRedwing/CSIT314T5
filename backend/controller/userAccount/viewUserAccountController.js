import { createError } from "../../utils/error.js";
import {UserAccount} from "../../entity/UserAccount.js";

export class viewUserAccountController{
    static async viewUserAccount(req, res, next){
        try{
            const users = await UserAccount.viewUserAccount();
            console.log(users.profile_id)
            res.status(200).json(users);
        }catch(error){
            console.log(error.message);
            return next(createError(400, "No User Account has been created"));
        }
    }
}