import bcrypt from 'bcrypt';
import {query} from "../utils/connectToDB.js"
import{
    createUserAccountQuery,
    viewUserAccountQuery,
    updateUserAccountQuery,
    findSpecificUserAccountQuery,
    suspendUserAccountQuery,
    viewAccountByUserNameRoleQuery
} from "../utils/sqlQuery.js"

export class UserAccount{
    constructor({id,username, email, password, profile_id, is_active, time_stamp}){
        this.id = id
        this.username = username;
        this.email = email;
        this.password = password;
        this.profile_id = profile_id;
        this.is_active = is_active;
        this.time_stamp = time_stamp;
    }

    isValid(){
        return this.username && this.email && this.password && this.profile_id && this.is_active && this.time_stamp;
    }

    static fromDB(row){
        return new UserAccount({
            id : row.id,
            username: row.username,
            email: row.email,
            password: row.password,
            profile_id: row.profile_id,
            is_active: row.is_active,
            time_stamp: row.time_stamp
        });
    }

    async hashPassword(){
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
    }


    async createUserAccount(){
        await this.hashPassword();
        const {rows} = await query(createUserAccountQuery, [
            this.username,
            this.email,
            this.password,
            this.profile_id,
            this.is_active,
            this.time_stamp
        ]);
        return UserAccount.fromDB(rows[0]);
    }

    static async viewUserAccount(){
        const {rows} = await query(viewUserAccountQuery);
        return rows.map(UserAccount.fromDB);
    }

    static async searchUserAccount(username, role){
        const {rows} = await query(viewAccountByUserNameRoleQuery, [
            username || null,
            role || null
        ]);
        return rows.map(UserAccount.fromDB);
    }

    static async findByUserId(id){
        const {rows} = await query(findSpecificUserAccountQuery, [id]);
        if(!rows.length){
            return null;
        }
        return UserAccount.fromDB(rows[0]);
    }

    static async updateUserAccount(id, {username, email, password, profile_id, is_active}){
        let hashedPassword = null;
    
        if (password) {
            const existingUser = await this.findByUserId(id);
            if (!existingUser) return false;
            const isSamePassword = await bcrypt.compare(password, existingUser.password);
            if (!isSamePassword) {
                const saltRounds = 10;
                hashedPassword = await bcrypt.hash(password, saltRounds);
            } else {
                hashedPassword = existingUser.password;
            }
        }
        const {rowCount, rows} = await query(updateUserAccountQuery, [
            username,
            email,
            hashedPassword,
            profile_id,
            is_active,
            id
        ]);
        if (rowCount === 0){
            return null;
        }
        return true;
    }

    static async suspendUserAccount(id){
        const {rowCount} = await query(suspendUserAccountQuery, [id]);
        return rowCount > 0;
    }

    static async comparePassword(enteredPassword, storedHash){
        const match = await bcrypt.compare(enteredPassword, storedHash);
        return match;
    }
}