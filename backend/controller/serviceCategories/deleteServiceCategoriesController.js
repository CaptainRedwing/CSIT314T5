import { createError } from "../../utils/error.js";
import {ServiceCategories} from "../../entity/ServiceCategories.js";

export class deleteServiceCategoriesController{
    static async deleteServiceCategories(req, res, next){
        try{
            const id = req.params.id;
            const serviceCategories = await ServiceCategories.deleteServiceCategories(id, req.body);

            if(!serviceCategories){
                return next(createError(400, "Service Categories Not Found"));
            }
            res.status(200).json({message: "Deleted Successfully"});
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}