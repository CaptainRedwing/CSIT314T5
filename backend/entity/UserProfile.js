import { query } from "../utils/connectToDB.js";
import {
    createUserProfileQuery,
    viewUserProfileQuery,
    updateUserProfileQuery,
    suspendUserProfileQuery,
    searchUserProfileQuery,
    viewProfileByIdQuery
} from "../utils/sqlQuery.js";

export class UserProfile{
    constructor({id, name, description, is_active}){
        this.id = id;
        this.name = name;
        this.description = description;
        this.is_active = is_active;
    }

    isValid(){
        return this.name && this.description && this.is_active;
    }
    
    static fromDB(row){
        return new UserProfile({
            id : row.id,
            name : row.name,
            description : row.description,
            is_active : row.is_active
        });
    }

    async createUserProfile() {
        const enumExistsQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM pg_type t
                JOIN pg_enum e ON t.oid = e.enumtypid
                WHERE t.typname = 'profile_type' AND e.enumlabel = $1
            ) AS exists;
            `;
            const enumCheck = await query(enumExistsQuery, [this.name]);
            const roleExists = enumCheck.rows[0].exists;

            if(!roleExists){
                const alterEnumQuery = `ALTER TYPE profile_type ADD VALUE IF NOT EXISTS '${this.name}'`;
                await query(alterEnumQuery);
            }

            const {rows} = await query(createUserProfileQuery, [
                this.name,
                this.description,
                this.is_active
            ]);
            return UserProfile.fromDB(rows[0]);
}


    static async viewUserProfile(){
        const {rows} = await query(viewUserProfileQuery);
        return rows.map(UserProfile.fromDB);
    }

    static async updateUserProfile(id, {name, description, is_active}){
        const {rowCount, rows} = await query(updateUserProfileQuery, [
            name,
            description,
            is_active,
            id
        ]);
        if(rowCount == 0){
            return false;
        }
        return true;
    }

    static async suspendUserProfile(id){
        const {rowCount} = await query(suspendUserProfileQuery, [id]);
        return rowCount > 0;
    }

    static async searchUserProfile(name){
        const {rows} = await query(searchUserProfileQuery, [name]);
        if(!rows.length){
            return null;
        }
        return rows.map(UserProfile.fromDB);
    }
    static async viewSpecifyById(id){
        const {rows} = await query(viewProfileByIdQuery, [id]);
        if(!rows.length){
            return null;
        }
        return UserProfile.fromDB(rows[0]);
    }
}