import { createError } from "../../utils/error.js";
import { PlatformReport } from "../../entity/PlatformReport.js";

export class generateMonthlyReportController{
    static async generateMonthlyReport(req, res, next){
        try{
            const monthlyReport = new PlatformReport(req.body);
            if(!monthlyReport.isValid()){
                return res.status(401).json({error: "Invalid input"});
            }
            const newMonthlyReport = await monthlyReport.generateMonthlyReport();
            res.status(201).json(newMonthlyReport);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}