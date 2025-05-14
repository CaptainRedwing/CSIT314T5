import { query } from "../utils/connectToDB.js";
import { 
    cleanerViewMatchHistoryQuery,
    cleanerSearchMatchHistoryQuery,
    homeownerViewMatchHistoryQuery,
    homeownerSearchMatchHistoryQuery
 } from "../utils/sqlQuery.js";

 export class MatchHistory{
    constructor({id, service_listing_id, homeowner_id, date_confirmed, service_date, status}){
        this.id = id;
        this.service_listing_id = service_listing_id;
        this.homeowner_id = homeowner_id;
        this.date_confirmed = date_confirmed;
        this.service_date = service_date;
        this.status = status;
    }
    
    isValid(){
        return this.service_listing_id && this.homeowner_id && this.date_confirmed && this.service_date && this.status;
    }

    static fromDB(row){
        return new MatchHistory({
            id: row.id,
            service_listing_id: row.service_listing_id,
            homeowner_id: row.homeowner_id,
            date_confirmed: row.date_confirmed,
            service_date: row.service_date,
            status: row.status
        });
    }

    static async cleanerViewMatchHistory(cleaner_id){
        const {rows} = await query(cleanerViewMatchHistoryQuery, [cleaner_id]);
        if(!rows.length){
            return null;
        }
        return rows.map(MatchHistory.fromDB);
    }

    static async cleanerSearchMatchHistory(cleaner_id){
        const {rows} = await query(cleanerSearchMatchHistoryQuery, [cleaner_id]);
        if(!rows.length){
            return null;
        }
        return MatchHistory.fromDB(rows[0]);
    }

    static async homeownerViewMatchHistory(homeowner_id){
        const {rows} = await query(homeownerViewMatchHistoryQuery, [homeowner_id]);
        if(!rows.length){
            return null;
        }
        return rows.map(MatchHistory.fromDB);
    }

    static async homeownerSearchMatchHistory(homeowner_id){
        const {rows} = await query(homeownerSearchMatchHistoryQuery, [homeowner_id]);
        if(!rows.length){
            return null;
        }
        return MatchHistory.fromDB(rows[0]);
    }
 }