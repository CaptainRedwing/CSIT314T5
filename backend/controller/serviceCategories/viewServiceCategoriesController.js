import { createError } from "../../utils/error.js";
import {ServiceCategories} from "../../entity/ServiceCategories.js";

export class viewServiceCategoriesController{
    static async viewServiceCategories(req, res, next){
        try{
            const serviceCategories = await ServiceCategories.viewServiceCategories();
            res.status(200).json(serviceCategories);
        }catch(error){
            console.log(error.message);
            return next(createError(400, "No Service Categories Found"))
        }
    }
}