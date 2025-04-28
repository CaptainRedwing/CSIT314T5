import { query } from "../utils/connectToDB.js";
import { loginQuery, getAllrole } from "../utils/sqlQuery.js";
import { createError } from "../utils/error.js";
import { LoginUser } from "../entity/LoginUser.js";

export class LoginController {
  
  static async login(req, res, next) {
    try {
      const user = new LoginUser(req.body);

      if (!user.isValid()) {
        return res.status(400).json({ error: 'All fields are required and must be valid' });
      }

      const isAuthenticated = await user.authenticate(); 

      if (isAuthenticated) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ success: false, error: 'Authentication failed' });
      }

    } catch (error) {
      console.error(error.message);
      return next(createError(500, 'Login failed'));
    }
  }
  

  static async roles(req, res, next) {
    try {
      const result = await query(getAllrole);
      const roles = result.rows.map(row => row.role);
      res.json({ roles });
    } catch (error) {
      console.error(error.message);
      return next(createError(500, 'Failed to fetch roles'));
    }
  }
}
