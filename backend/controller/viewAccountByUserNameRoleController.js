import { createError } from "../utils/error.js";
import {UserAccount} from "../entity/UserAccount.js";

export class viewAccountByUserNameRoleController{
    static async viewAccountByUserNameRole(req, res, next){
        try{
            const {username, role} = req.query;
            const users = await UserAccount.findByUsernameAndRole(username, role);
            res.status(200).json(users);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}