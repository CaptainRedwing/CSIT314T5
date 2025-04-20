import { query } from "../utils/connectToDB.js";
import { createError } from "../utils/error.js";
import {createRoleQuery,
        createUserAccountTableQuery,
        createUserAccountQuery,
        viewUserAccountQuery,
        updateUserAccountQuery,
        findSpecificUserAccountQuery,
        suspendUserAccountQuery} from "../utils/sqlQuery.js";

export async function viewUserAccount(req,res,next){
    try {
        const response = await query(`
            SELECT to_regclass('user_account_details');
            `);
        console.log(response);
        if (!response.rows[0].to_regclass){
            await query(createRoleQuery);
            await query(createUserAccountTableQuery);
        }            
        const{rows} = await query(viewUserAccountQuery);
        res.status(200).json(rows)
    } catch (error) {
        console.log(error.message);
        return next(createError(400, "No User Accout has created"));
    }
}

export async function createUserAccount(req, res, next){
    try{
        const {username, email, password, role} = req.body;
        if(!username || !email || !password || !role){
            return res.status(400).json({error:"Missing fields"})
        };
        const data = await query(createUserAccountQuery,[
            username,
            email, 
            password,
            role,
        ]);
        res.status(201).json(data.rows[0])
    } catch (error){
        console.log('Error creating user:', error.messgae);
        return next(createError(400, error.message));
    }
}

export async function findSpecificUserAccount(req, res, next){
    const id = req.params.id;
    const data = await query(findSpecificUserAccountQuery, [id]);
    console.log(data);
    if(!data.rows.length){
        return next(createError(400, "User Account Not Found!"))
    }
    res.status(200).json(data.rows[0]);
}

export async function suspendUserAccount(req, res, next){
    const id = req.params.id;
    const data = await query(suspendUserAccountQuery, [id]);
    console.log(data);
    if(!data.rowCount){
        return next(createError(400), "User Account Not Found!")
    }
    res.status(200).json({message:"Delete successfully!"});
}

export async function updateUserAccount(req, res, next){
    try{
        const {id} = req.params;
        const {username, email, password, role} = req.body;
        const result = await query(updateUserAccountQuery, [username, email, password, role, id]);
        if(result.rowCount == 0){
            return res.status(400).json({error:"User Not Found!"});
        }
        res.status(200).json(result.rows[0]);
    } catch(error){
        res.status(400).json({error: error.message});
    }
}

