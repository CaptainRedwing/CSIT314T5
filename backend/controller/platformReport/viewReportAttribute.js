import { createError } from "../../utils/error.js";
import { PlatformReport } from "../../entity/PlatformReport.js";

export class viewReportAttributeController{
    static async viewReportAttribute(req, res, next){
        try{
            const reportAttribute = await PlatformReport.viewReportAttribute();
            res.status(200).json(reportAttribute);
        }catch(error){
            console.log(error.message);
            return next(createError(400, "No favourite listing has been created"))
        }
    }
}