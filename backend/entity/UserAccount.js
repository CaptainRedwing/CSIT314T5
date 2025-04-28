import {query} from "../utils/connectToDB.js"
import{
    createUserAccountQuery,
    viewUserAccountQuery,
    viewAccountByUserNameRoleQuery,
    updateUserAccountQuery,
    findSpecificUserAccountQuery,
    suspendUserAccountQuery,
    createRoleQuery,
    createUserAccountTableQuery
} from "../utils/sqlQuery.js"

export class UserAccount{
    constructor({id,username, email, password, role}){
        this.id = id
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    isValid(){
        return this.username && this.email && this.password && this.role;
    }

    static fromDB(row){
        return new UserAccount({
            id : row.id,
            username: row.username,
            email: row.email,
            password: row.password,
            role: row.role
        });
    }
    async save(){
        const {rows} = await query(createUserAccountQuery, [
            this.username,
            this.email,
            this.password,
            this.role
        ]);
        return UserAccount.fromDB(rows[0]);
    }

    static async findAll(){
        const response = await query(`
           SELECT to_regclass('user_account_details'); 
        `);
        if (!response.rows[0].to_regclass){
            await query(createRoleQuery);
            await query(createUserAccountTableQuery);
        }
        const {rows} = await query(viewUserAccountQuery);
        return rows.map(UserAccount.fromDB);
    }

    static async findByUsernameAndRole(username, role){
        const {rows} = await query(viewAccountByUserNameRoleQuery, [
            username || null,
            role || null
        ]);
        return rows.map(UserAccount.fromDB);
    }

    static async findById(id){
        const {rows} = await query(findSpecificUserAccountQuery, [id]);
        if(!rows.length){
            return null;
        }
        return UserAccount.fromDB(rows[0]);
    }

    static async updateById(id, {username, email, password, role}){
        const {rowCount, rows} = await query(updateUserAccountQuery, [
            username,
            email,
            password,
            role,
            id
        ]);
        if (rowCount == 0){
            return null;
        }
        return UserAccount.fromDB(rows[0]);
    }

    static async suspendById(id){
        const {rowCount} = await query(suspendUserAccountQuery, [id]);
        return rowCount > 0;
    }
}