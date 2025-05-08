import { createError } from "../../utils/error.js";
import {ServiceCategories} from "../../entity/ServiceCategories.js";

export class updateServiceCategoriesController{
    static async updateServiceCategories(req, res, next){
        try{
            const id = req.params.id;
            const serviceCategories = await ServiceCategories.updateServiceCategories(id, req.body);
            if(!serviceCategories){
                return res.status(400).json({error: "Service Categories Not Found"});
            }
            res.status(200).json(serviceCategories);
        }catch(error){
            console.log(error.message);
            res.status(400).json({error: error.message});
        }
    }
}