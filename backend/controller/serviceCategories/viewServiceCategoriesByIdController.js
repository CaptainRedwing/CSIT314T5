import { createError } from "../../utils/error.js";
import { ServiceCategories } from "../../entity/ServiceCategories.js";

export class viewServiceCategoriesByIdController{
    static async viewServiceCategoriesById(req, res, next){
        try{
            const id = req.params.id;
            console.log(id)
            const serviceCategories = await ServiceCategories.viewSpecifyById(id);
            if(!serviceCategories){
                return next(createError(400, "Service Listing Not Found"));
            }
            res.status(200).json(serviceCategories);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}