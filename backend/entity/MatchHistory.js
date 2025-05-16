import { query } from "../utils/connectToDB.js";
import { 
    cleanerViewMatchHistoryQuery,
    cleanerSearchMatchHistoryQuery,
    homeownerViewMatchHistoryQuery,
    homeownerSearchMatchHistoryQuery,
    cleanerSearchPageAttributes,
    cleanerViewPageAttributes,
    homeownerViewMatchHistoryAttributes,
    homeownerSearchMatchHistoryAttributes
 } from "../utils/sqlQuery.js";

 export class MatchHistory{
    constructor({id, service_listing_id, homeowner_id, date_confirmed, service_date, status, title, service_categories_name, price, description,cleaner_id}){
        this.id = id;
        this.service_listing_id = service_listing_id;
        this.homeowner_id = homeowner_id;
        this.date_confirmed = date_confirmed;
        this.service_date = service_date;
        this.status = status;
        this.title = title;
        this.service_categories_name = service_categories_name;
        this.price = price;
        this.description = description;
        this.cleaner_id = cleaner_id;
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
            status: row.status,
            title: row.title,
            service_categories_name : row.service_categories_name,
            price : row.price,
            description : row.description,
            cleaner_id : row.cleaner_id
        });
    }

    static async cleanerViewMatchHistory(cleaner_id){
        const {rows} = await query(cleanerViewPageAttributes, [cleaner_id]);
        if(!rows.length){
            return null;
        }
        console.log(rows)
        return MatchHistory.fromDB(rows[0]);
    }

    static async cleanerSearchMatchHistory(cleaner_id){
        const {rows} = await query(cleanerSearchPageAttributes, [cleaner_id]);
        if(!rows.length){
            return null;
        }
        return MatchHistory.fromDB(rows[0]);
    }

    static async homeownerViewMatchHistory(homeowner_id){
        const {rows} = await query(homeownerViewMatchHistoryAttributes, [homeowner_id]);
        if(!rows.length){
            return null;
        }
        return MatchHistory.fromDB(rows[0]);
    }

    static async homeownerSearchMatchHistory(homeowner_id){
        const {rows} = await query(homeownerSearchMatchHistoryAttributes, [homeowner_id]);
        if(!rows.length){
            return null;
        }
        return MatchHistory.fromDB(rows[0]);
    }
 }