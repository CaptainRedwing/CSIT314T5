import { createError } from "../../utils/error.js";
import { MatchHistory } from "../../entity/MatchHistory.js";

export class homeownerSearchMatchHistoryController{
    static async homeownerSearchMatchHistory(req, res, next){
        try{
            const homeowner_id = req.params.homeowner_id;
            console.log(homeowner_id)
            const matchHistory = await MatchHistory.homeownerSearchMatchHistory(homeowner_id);
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