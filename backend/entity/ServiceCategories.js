import { query } from "../utils/connectToDB.js";
import {
    createServiceCategoriesTableQuery,
    createServiceCategoriesQuery,
    viewServiceCategoriesQuery,
    updateServiceCategoriesQuery,
    deleteServiceCategoriesQuery,
    searchServiceCategoriesQuery,
    viewServiceCategoryByIdQuery
} from "../utils/sqlQuery.js";

export class ServiceCategories{
    constructor({id, name, description}){
        this.id = id;
        this.name = name;
        this.description = description;
    }

    isValid(){
        return this.name && this.description;
    }

    static fromDB(row){
        return new ServiceCategories({
            id: row.id,
            name: row.name,
            description: row.description
        });
    }

    async createServiceCategories(){
        const {rows} = await query(createServiceCategoriesQuery, [
            this.name,
            this.description
        ]);
        return ServiceCategories.fromDB(rows[0]);
    }

    static async viewServiceCategories(){
        const response = await query(`
            SELECT to_regclass('service_categories_details');
            `);
        if(!response.rows[0].to_regclass){
            await query(createServiceCategoriesTableQuery);
        }
        const {rows} = await query(viewServiceCategoriesQuery);
        return rows.map(ServiceCategories.fromDB);
    }

    static async updateServiceCategories(id, {name, description}){
        const {rowCount, rows} = await query(updateServiceCategoriesQuery, [
            name,
            description,
            id
        ]);
        if(rowCount == 0){
            return false;
        }
        return true;
    }

    static async deleteServiceCategories(id){
        const {rowCount} = await query(deleteServiceCategoriesQuery, [id]);
        if (rowCount == 0){
            return false;
        }
        return true;
    }

    static async searchServiceCategories(id){
        const {rows} = await query(searchServiceCategoriesQuery, [id]);
        if(!rows.length){
            return null;
        }
        return rows.map(ServiceCategories.fromDB);
    }

    static async viewSpecifyById(id){
        const {rows} = await query(viewServiceCategoryByIdQuery, [id]);
        if(!rows.length){
            return null;
        }
        return ServiceCategories.fromDB(rows[0]);
    }

    




}