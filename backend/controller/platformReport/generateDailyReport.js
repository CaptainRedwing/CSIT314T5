import { createError } from "../../utils/error.js";
import { PlatformReport } from "../../entity/PlatformReport.js";

export class generateDailyReportController{
    static async generateDailyReport(req, res, next){
        try{
            const dailyReport = new PlatformReport(req.body);
            if(!dailyReport.isValid()){
                return res.status(401).json({error: "Invalid input"});
            }
            const newDailyReport = await dailyReport.generateDailyReport();
            res.status(201).json(newDailyReport);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}