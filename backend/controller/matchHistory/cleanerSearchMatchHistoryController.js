import { createError } from "../../utils/error.js";
import { MatchHistory } from "../../entity/MatchHistory.js";

export class cleanerSearchMatchHistoryController{
    static async cleanerSearchMatchHistory(req, res, next){
        try{
            const cleaner_id = req.params.cleaner_id;
            const matchHistory = await MatchHistory.cleanerSearchMatchHistory(cleaner_id);
            if(!matchHistory){
                return next(createError(400, "Match History Not Found"));
            }
            res.status(200).json(matchHistory)
        }catch(error){
            console.log(error.message);
            return next(createError(400, error.message));
        }
    }
}