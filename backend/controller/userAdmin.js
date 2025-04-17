import { query } from "../utils/connectToDB.js";
import { createError } from "../utils/error.js";
import { createUserAccountQuery, getUserAccountQuery } from "../utils/sqlQuery.js";

export async function getAllUserAccount(req,res,next){
    try {
        const response = await query(`
            SELECT to_regclass('user_account_details');
            `);
            console.log(response);
            if (!response.rows[0].to_regclass){
                await query(createUserAccountQuery);
            }

            const {rows} = await query(getUserAccountQuery);
            res.status(200).json(rows)
    } catch (error) {
        console.log(error,message);
        return next(createError(400, "No User Accout has created"));
    }
}

export async function createUserAccount(req, res, next){}

export async function viewUserAccount(req, res, next){}

export async function searchUserAccount(req, res, next){}

export async function suspendUserAccount(req, res, next){}

export async function updateUserAccount(req, res, next){}

