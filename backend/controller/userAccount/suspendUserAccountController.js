import { createError } from "../../utils/error.js";
import {UserAccount} from "../../entity/UserAccount.js";

export class suspendUserAccountController{
    static async suspendUserAccount(req, res, next){
        try{
            const id = req.params.id;
            const success = await UserAccount.suspendUserAccount(id, req.body);
            if(!success){
                return next(createError(400, "User Account Not Found"));
            }
            res.status(200).json({message: "Suspended Successfully"});
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}