import { createError } from "../../utils/error.js";
import { MatchHistory } from "../../entity/MatchHistory.js";

export class homeownerViewMatchHistoryController{
    static async homeownerViewMatchHistory(req, res, next){
        try{
            const homeowner_id = req.params.homeowner_id;
            const matchHistory = await MatchHistory.homeownerViewMatchHistory(homeowner_id);
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