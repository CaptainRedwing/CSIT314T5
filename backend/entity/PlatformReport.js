import { query } from "../utils/connectToDB.js";
import { 
    generateDailyReportQuery,
    generateWeeklyReportQuery,
    generateMonthlyReportQuery,
    viewReportAttributeQuery
 } from "../utils/sqlQuery.js";

export class PlatformReport{
    constructor({id, date_of_report, type_of_report, new_user, match_service, created_service, most_viewed_service, added_favourite}){
        this.id = id;
        this.date_of_report = date_of_report;
        this.type_of_report = type_of_report;
        this.new_user = new_user;
        this.match_service = match_service;
        this.created_service = created_service;
        this.most_viewed_service = most_viewed_service;
        this.added_favourite = added_favourite;
    }

    isValid(){
        return this.date_of_report;
    }

    static fromDB(row){
        return new PlatformReport({
            id: row.id,
            date_of_report: row.date_of_report,
            type_of_report: row.type_of_report,
            new_user : row.new_user,
            match_service : row.match_service,
            created_service : row.created_service,
            most_viewed_service : row.most_viewed_service,
            added_favourite : row.added_favourite

        });
    }

    static async viewReportAttribute(){
        const {rows} = await query(viewReportAttributeQuery);
        return rows.map(PlatformReport.fromDB);
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