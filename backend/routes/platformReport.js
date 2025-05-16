import express from "express";
import { generateDailyReportController } from "../controller/platformReport/generateDailyReport.js";
import { generateWeeklyReportController } from "../controller/platformReport/generateWeeklyReportController.js";
import { generateMonthlyReportController } from "../controller/platformReport/generateMonthlyReportController.js";

const router = express.Router();

router.post("/daily/", generateDailyReportController.generateDailyReport);
router.post("/weekly/", generateWeeklyReportController.generateWeeklyReport);
router.post("/monthly/", generateMonthlyReportController.generateMonthlyReport);

export default router;