import { createError } from "../../utils/error.js";
import {ServiceCategories} from "../../entity/ServiceCategories.js";

export class createServiceCategoriesController{
    static async createServiceCategories(req, res, next){
        try{
            const serviceCategories = new ServiceCategories(req.body);

            if(!serviceCategories.isValid()){
                return res.status(401).json({error: "Invalid service category input"});
            }
            const newServiceCategory = await serviceCategories.createServiceCategories();
            res.status(201).json(newServiceCategory);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}