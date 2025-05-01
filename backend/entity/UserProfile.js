import { query } from "../utils/connectToDB.js";
import {
    createUserProfileTableQuery,
    createRoleQuery,
    createUserProfileQuery,
    viewUserProfileQuery,
    updateUserProfileQuery,
    suspendUserProfileQuery,
    searchUserProfileQuery
} from "../utils/sqlQuery.js";

export class UserProfile{
    constructor({id, name, profile_type, description, is_active}){
        this.id = id;
        this.name = name;
        this.profile_type = profile_type;
        this.description = description;
        this.is_active = is_active;
    }

    isValid(){
        return this.name && this.profile_type && this.description && this.is_active;
    }
    
    static fromDB(row){
        return new UserProfile({
            id : row.id,
            name : row.name,
            profile_type : row.profile_type,
            description : row.description,
            is_active : row.is_active
        });
    }

    async createUserProfile(){
        const {rows} = await query(createUserProfileQuery, [
            this.name,
            this.profile_type,
            this.description,
            this.is_active
        ]);
        return UserProfile.fromDB(rows[0]);
    }

    static async viewUserProfile(){
        const response = await query(`
            SELECT to_regclass('user_profile_details');    
        `);
        if(!response.rows[0].to_regclass){
            await query(createRoleQuery),
            await query(createUserProfileTableQuery);
        }
        const {rows} = await query(viewUserProfileQuery);
        return rows.map(UserProfile.fromDB);
    }

    static async updateUserProfile(id, {name, profile_type, description, is_active}){
        const {rowCount, rows} = await query(updateUserProfileQuery, [
            name,
            profile_type,
            description,
            is_active,
            id
        ]);
        if(rowCount == 0){
            return null;
        }
        return UserProfile.fromDB(rows[0]);
    }

    static async suspendUserProfile(id){
        const {rowCount} = await query(suspendUserProfileQuery, [id]);
        return rowCount > 0;
    }

    static async searchUserProfile(id){
        const {rows} = await query(searchUserProfileQuery, [id]);
        if(!rows.length){
            return null;
        }
        return UserProfile.fromDB(rows[0]);
    }
}