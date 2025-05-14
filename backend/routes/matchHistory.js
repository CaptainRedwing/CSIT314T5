import express from "express";
import { cleanerViewMatchHistoryController } from "../controller/matchHistory/cleanerViewMatchHistoryController.js";
import { cleanerSearchMatchHistoryController } from "../controller/matchHistory/cleanerSearchMatchHistoryController.js";
import { homeownerViewMatchHistoryController } from "../controller/matchHistory/homeownerViewMatchHistoryController.js";
import { homeownerSearchMatchHistoryController } from "../controller/matchHistory/homeownerSearchMatchHistoryController.js";

const router = express.Router();

router.get("/cview/:cleaner_id", cleanerViewMatchHistoryController.cleanerViewMatchHistory);
router.get("/csearch/:cleaner_id", cleanerSearchMatchHistoryController.cleanerSearchMatchHistory);
router.get("/hview/:homeowner_id", homeownerViewMatchHistoryController.homeownerViewMatchHistory);
router.get("/hsearch/:homeowner_id", homeownerSearchMatchHistoryController.homeownerSearchMatchHistory);




export default router;