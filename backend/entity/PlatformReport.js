import { query } from "../utils/connectToDB.js";
import { 
    generateDailyReportQuery,
    generateWeeklyReportQuery,
    generateMonthlyReportQuery
 } from "../utils/sqlQuery.js";

export class PlatformReport{
    constructor({id, date_of_report, type_of_report}){
        this.id = id;
        this.date_of_report = date_of_report;
        this.type_of_report = type_of_report;
    }

    isValid(){
        return this.date_of_report;
    }

    static fromDB(row){
        return new PlatformReport({
            id: row.id,
            date_of_report: row.date_of_report,
            type_of_report: row.type_of_report
        });
    }

    async generateDailyReport(){
        const {rows} = await query(generateDailyReportQuery, [
            this.date_of_report
        ]);
        return PlatformReport.fromDB(rows[0]);
    }

    async generateWeeklyReport(){
        const {rows} = await query(generateWeeklyReportQuery, [
            this.date_of_report
        ]);
        return PlatformReport.fromDB(rows[0]);
    }

    async generateMonthlyReport(){
        const {rows} = await query(generateMonthlyReportQuery, [
            this.date_of_report
        ]);
        return PlatformReport.fromDB(rows[0]);
    }
}