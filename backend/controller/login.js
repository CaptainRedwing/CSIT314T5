import { query } from "../utils/connectToDB.js";
import { loginQuery } from "../utils/sqlQuery.js";
import { createError } from "../utils/error.js";
import { createAccountTypeQuery, createUserTableQuery, createUserQuery } from "../utils/sqlQuery.js";

export async function login(req, res, next) {
    const { useraccount: account, password, accountType: account_type } = req.body;

    try {

        const response = await query(`
            SELECT to_regclass('users');
            `)
        console.log(response);
        
        if (response.rows[0].to_regclass){
             await query(createAccountTypeQuery);
             await query(createUserTableQuery);
             await query(createUserQuery,['admin123','adminpass','UserAdmin']);
             await query(createUserQuery,['cleaner123','cleanerpass','Cleaner']);
             await query(createUserQuery,['homeowner123','homeownerpass','Homeowner']);
             await query(createUserQuery,['manager123','managerpass','PlatformManager']);
        }

        if (!account || !password || !account_type) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const userResult = await query(loginQuery, [account, password, account_type]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = userResult.rows[0];
        res.status(200).json({ 
            message: 'Login successful',
            user: {
                ...user,
                accountType: account_type // Ensure consistent naming
            }
        });

    } catch (error) {
        console.log(error.message);
        return next(createError(500, 'Login failed'));
    }
}