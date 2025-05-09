import { query } from "../utils/connectToDB.js";
import {
    createServiceListingTableQuery,
    createServiceListingQuery,
    viewServiceListingQuery,
    updateServiceListingQuery,
    suspendServiceListingQuery,
    searchServiceListingQuery,
    roleCheckingTriggerAndTriggerFunction
} from "../utils/sqlQuery.js";

export class ServiceListing{
    constructor({id, cleaner_id, title, description, price, location, is_active}){
        this.id = id;
        this.cleaner_id = cleaner_id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.is_active = is_active;
    }

    isValid(){
        return this.cleaner_id && this.title && this.description && this.price && this.location && this.is_active;
    }

    static fromDB(row){
        return new ServiceListing({
            id: row.id,
            cleaner_id: row.cleaner_id,
            title: row.title,
            description: row.description,
            price: row.price,
            location: row.location,
            is_active: row.is_active
        });
    }

    async createServiceLisitng(){
        await query(roleCheckingTriggerAndTriggerFunction);
        const {rows} = await query(createServiceListingQuery, [
            this.cleaner_id,
            this.title,
            this.description,
            this.price,
            this.location,
            this.is_active
        ]);
        return ServiceListing.fromDB(rows[0]);
    }

    static async viewServiceListing(){
        const response = await query(`
            SELECT to_regclass('service_listing_details');
            `);
        if(!response.rows[0].to_regclass){
            await query(createServiceListingTableQuery);
        }
        const {rows} = await query(viewServiceListingQuery);
        return rows.map(ServiceListing.fromDB);
    }

    static async updateServiceListing(id, {cleaner_id, title, description, price, location, is_active}){
        const {rowCount, rows} = await query(updateServiceListingQuery, [
            cleaner_id,
            title,
            description,
            price,
            location,
            is_active,
            id
        ]);
        if(rowCount == 0){
            return false;
        }
        return true;
    }

    static async suspendServiceListing(id){
        const {rowCount} = await query(suspendServiceListingQuery, [id]);
        if(rowCount == 0){
            return false;
        }
        return true;
    }

    static async searchServiceListing(name){
        const {rows} = await query(searchServiceListingQuery, [name]);
        if(!rows.length){
            return null;
        }
        return ServiceListing.fromDB(rows[0]);
    }







}