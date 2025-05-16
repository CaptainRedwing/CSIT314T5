import { createError } from "../../utils/error.js";
import {ServiceCategories} from "../../entity/ServiceCategories.js";

export class searchServiceCategoriesController{
    static async searchServiceCategories(req, res, next){
        try{
            const name = req.params.name;
            console.log(name)
            const serviceCategories = await ServiceCategories.searchServiceCategories(name);
            console.log(serviceCategories)
            if(!serviceCategories){
                return next(createError(400, "Service Categories Not Found"));
            }
            res.status(200).json(serviceCategories);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}