import {query} from "../utils/connectToDB.js";
import { loginQuery } from "../utils/sqlQuery.js";

export class LoginUser{
    constructor({UserAccount, password, accountType}){
        this.UserAccount = UserAccount;
        this.password = password;
        this.accountType = accountType;
    }

    isValid(){
        return (
            this.UserAccount &&
            typeof this.UserAccount === 'string' &&
            this.password &&
            typeof this.password === 'string' &&
            this.accountType &&
            typeof this.accountType === 'string'
        );
    }

    async authenticate(){
        const {rows} = await query(loginQuery, [
            this.UserAccount,
            this.password,
            this.accountType
        ]);
        if(rows.length === 0){
            throw new Error("Invalid credentials");
        }
        return rows[0];
    }
    
}