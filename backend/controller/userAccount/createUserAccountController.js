import { createError } from "../../utils/error.js";
import {UserAccount} from "../../entity/UserAccount.js";

export class createUserAccountController{
    static async createUserAccount(req, res, next){
        try{
            const user = new UserAccount(req.body);

            if(!user.isValid()){
                console.log(user.profile_id)


                return res.status(400).json({error:"Invalid user input"});
            }
            const newUser = await user.createUserAccount();
            res.status(201).json(newUser);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}