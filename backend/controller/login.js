import { query } from "../utils/connectToDB.js";
import { loginQuery } from "../utils/sqlQuery.js";
import { createError } from "../utils/error.js";
import { LoginUser } from "../entity/LoginUser.js";

export async function login(req, res, next) {
  try {
    const user = new LoginUser(req.body);

    if (!user.isValid()) {
      return res.status(400).json({ error: 'All fields are required and must be valid' });
    }

    const userResult = await query(loginQuery, [
      user.useraccount,
      user.password,
      user.accountType,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userData = userResult.rows[0];
    res.status(200).json({
      message: 'Login successful',
      user: {
        ...userData,
        accountType: user.accountType, // consistent naming
      }
    });

  } catch (error) {
    console.error(error.message);
    return next(createError(500, 'Login failed'));
  }
}
