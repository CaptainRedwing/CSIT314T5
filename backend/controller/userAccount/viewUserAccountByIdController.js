import { createError } from "../../utils/error.js";
import {UserAccount} from "../../entity/UserAccount.js";

export class viewUserAccountByIdController{
    
    static async viewUserAccountById(req, res, next){
        try{
            const id = req.params.id;
            const user = await UserAccount.findByUserId(id);

            if(!user){
                return next(createError(400, "User Account Not Found!"));
            }
            res.status(200).json(user);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}