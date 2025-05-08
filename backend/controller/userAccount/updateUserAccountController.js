import { createError } from "../../utils/error.js";
import {UserAccount} from "../../entity/UserAccount.js";

export class updateUserAccountController{
    static async updateUserAccount(req, res, next){
        try{
            const id = req.params.id;
            const updateUser = await UserAccount.updateUserAccount(id, req.body);
            if(!updateUser){
                return res.status(400).json({error: "User Not Found"});
            }
            res.status(200).json(updateUser);
        }catch(error){
            console.log(error.message);
            res.status(400).json({error: error.message});
        }
    }
}