import { query } from "../utils/connectToDB.js";
import {
    createServiceListingQuery,
    viewServiceListingQuery,
    updateServiceListingQuery,
    deleteServiceListingQuery,
    searchServiceListingQuery,
    cleanerCheckingTriggerAndTriggerFunction,
    incrementViewCountQuery,
    getViewCountQuery,
    incrementListedCountQuery,
    getListedCountQuery,
    viewServiceListingByIdQuery
} from "../utils/sqlQuery.js";

export class ServiceListing{
    constructor({id, cleaner_id, title, description, price, location, view_count, listed_count, service_categories_name, created_at}){
        this.id = id;
        this.cleaner_id = cleaner_id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.view_count = view_count;
        this.listed_count = listed_count;
        this.service_categories_name = service_categories_name;
        this.created_at = created_at;
    }

    isValid(){
        return this.cleaner_id && this.title && this.description && this.price && this.location && this.view_count && this.listed_count && this.service_categories_name && this.created_at;
    }

    static fromDB(row){
        return new ServiceListing({
            id: row.id,
            cleaner_id: row.cleaner_id,
            title: row.title,
            description: row.description,
            price: row.price,
            location: row.location,
            view_count: row.view_count,
            listed_count: row.listed_count,
            service_categories_name: row.service_categories_name,
            created_at : row.created_at
        });
    }

    async createServiceLisitng(){
        await query(cleanerCheckingTriggerAndTriggerFunction);
        const {rows} = await query(createServiceListingQuery, [
            this.cleaner_id,
            this.title,
            this.description,
            this.price,
            this.location,
            this.view_count,
            this.listed_count,
            this.service_categories_name,
            this.created_at
        ]);
        return ServiceListing.fromDB(rows[0]);
    }

    static async viewServiceListing(){
        const {rows} = await query(viewServiceListingQuery);
        return rows.map(ServiceListing.fromDB);
    }

    static async updateServiceListing(id, {cleaner_id, title, description, price, location, service_categories_name}){
        const {rowCount, rows} = await query(updateServiceListingQuery, [
            cleaner_id,
            title,
            description,
            price,
            location,
            service_categories_name,
            id
        ]);
        if(rowCount == 0){
            return false;
        }
        return true;
    }

    static async suspendServiceListing(id){
        const {rowCount} = await query(deleteServiceListingQuery, [id]);
        if(rowCount == 0){
            return false;
        }
        return true;
    }

    static async searchServiceListing(title){
        const {rows} = await query(searchServiceListingQuery, [title]);
        if(!rows.length){
            return null;
        }
        return rows.map(ServiceListing.fromDB);
    }

    static async updateAndGetViewCount(id){
        const {rows: incrementedRows} = await query(incrementViewCountQuery, [id]);
        if(!incrementedRows.length){
            return null;
        }
        const updatedViewCount = incrementedRows[0].view_count;
        const {rows: countRows} = await query(getViewCountQuery, [id]);
        if(!countRows.length){
            return null;
        }
        return countRows[0].view_count;
    }

    static async updateAndGetListedCount(id){
        const {rows: incrementedRows} = await query(incrementListedCountQuery, [id]);
        if(!incrementedRows.length){
            return null;
        }
        const updatedListedCount = incrementedRows[0].listed_count;
        const {rows: countRows} = await query(getListedCountQuery, [id]);
        if(!countRows.length){
            return null;
        }
        return countRows[0].listed_count;
    }

    static async viewServiceListingById(id){
        const {rows} = await query(viewServiceListingByIdQuery, [id]);
        if(!rows.length){
            return false;
        }
        return ServiceListing.fromDB(rows[0]);
    }
}