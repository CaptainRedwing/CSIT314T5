import { createError } from "../../utils/error.js";
import { PlatformReport } from "../../entity/PlatformReport.js";

export class generateWeeklyReportController{
    static async generateWeeklyReport(req, res, next){
        try{
            const weeklyReport = new PlatformReport(req.body);
            if(!weeklyReport.isValid()){
                return res.status(401).json({error: "Invalid input"});
            }
            const newWeeklyReport = await weeklyReport.generateWeeklyReport();
            res.status(201).json(newWeeklyReport);
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}