import {query} from "../utils/connectToDB.js";
import { loginQuery } from "../utils/sqlQuery.js";

export class LoginUser{
    constructor({userAccount, password, accountType}){
        this.userAccount = userAccount;
        this.password = password;
        this.accountType = accountType;
    }

    isValid(){
        return (
            this.userAccount &&
            typeof this.userAccount === 'string' &&
            this.password &&
            typeof this.password === 'string' &&
            this.accountType &&
            typeof this.accountType === 'string'   // change after create profileType
        );
    }

    async authenticate(){
        const {rows} = await query(loginQuery, [
            this.userAccount,
            this.password,
            this.accountType
        ]);
        if(rows.length === 0){
            throw new Error("Invalid credentials");
        }
        return rows[0];
    }
    
}