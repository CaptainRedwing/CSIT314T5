import { query } from "../utils/connectToDB.js";
import { createUserTableQuery,createAccountTypeQuery,getUserAdminQuery} from "../utils/sqlQuery.js";
import { createError } from "../utils/error.js";
import { Query } from "pg";

export async function getAllUser(req, res, nest) {
    try {
        const response = await query(`
            SELECT to_regclass('users')
            `);
        console.log(response);
        if (!response.rows[0].to_regclass){
            await query(createAccountTypeQuery);
            await query(createUserTableQuery);
        }

        const {rows} = await query(getUserAdminQuery);
        res.status(200).json(rows);
    } catch (error) {
        console.log(error.message);
        return next(createError(400, "Couldnt get UserAmind details!"));
    }
}   

e