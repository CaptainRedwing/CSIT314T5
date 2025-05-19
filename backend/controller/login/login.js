import { query } from "../../utils/connectToDB.js";
import { loginQuery, getAllrole } from "../../utils/sqlQuery.js";
import { createError } from "../../utils/error.js";
import { LoginUser } from "../../entity/LoginUser.js";

export class LoginController {
  
  static async login(req, res, next) {
      const user = new LoginUser(req.body);

      const isAuthenticated = await user.authenticate(); 

      if (isAuthenticated) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ success: false });
      }
  }
  

  static async roles(req, res, next) {

      const { rows  } = await query(getAllrole);

      console.log('Raw rows:', rows);

      const row = rows.map(row => row.role);

      res.status(200).json({ row });
  }
}