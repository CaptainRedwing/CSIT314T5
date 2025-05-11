import { query } from "../utils/connectToDB.js";
import{  
    createFavouriteListingTableQuery,
    saveFavouriteListingQuery,
    viewFavouriteListingQuery,
    searchFavouriteListingQuery,
    homeownerCheckingTriggerAndTriggerFunction
} from "../utils/sqlQuery.js";

export class FavouriteListing{
    constructor({id, homeowner_id, service_listing_id}){
        this.id = id;
        this.homeowner_id = homeowner_id;
        this.service_listing_id = service_listing_id;
    }

    isValid(){
        return this.homeowner_id && this.service_listing_id;
    }

    static fromDB(row){
        return new FavouriteListing({
            id: row.id,
            homeowner_id: row.homeowner_id,
            service_listing_id: row.service_listing_id
        });
    }

    async saveFavouriteListing(){
        await query(homeownerCheckingTriggerAndTriggerFunction);
        const {rows} = await query(saveFavouriteListingQuery,[
            this.homeowner_id,
            this.service_listing_id
        ]);
        return FavouriteListing.fromDB(rows[0]);
    }

    static async viewFavouriteListing(){
        const response = await query(`
            SELECT to_regclass('favourite_listing_details');
            `);
        if(!response.rows[0]){
            await query(createFavouriteListingTableQuery);
        }
        const {rows} = await query(viewFavouriteListingQuery);
        return rows.map(FavouriteListing.fromDB);
    }

    static async searchFavouriteListing(id){
        const {rows} = await query(searchFavouriteListingQuery, [id]);
        if(!rows.length){
            return null;
        }
        return FavouriteListing.fromDB(rows[0]);
    }
}