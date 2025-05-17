import { createError } from "../../utils/error.js";
import {UserAccount} from "../../entity/UserAccount.js";


export class createUserAccountController {
  static async createUserAccount(req, res, next) {
    try {
      const usersData = req.body; // expect an array here

      if (!Array.isArray(usersData)) {
        return res.status(400).json({ error: "Expected an array of users" });
      }

      const createdUsers = [];
      for (const userData of usersData) {
        const user = new UserAccount(userData);
        if (!user.isValid()) {
          // Optionally: collect all errors or just skip invalid users
          continue;
        }
        const newUser = await user.createUserAccount();
        createdUsers.push(newUser);
      }

      res.status(201).json({ createdCount: createdUsers.length, users: createdUsers });
    } catch (error) {
      console.log(error.message);
      return next(createError(400, error.message));
    }
  }
}
