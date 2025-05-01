import bcrypt from "bcrypt";
import { query } from "../utils/connectToDB.js";
import { loginQuery } from "../utils/sqlQuery.js";

export class LoginUser {
  constructor({ userAccount, password, accountType }) {
    this.userAccount = userAccount;
    this.password = password;
    this.accountType = accountType;
  }

  isValid() {
    return (
      this.userAccount &&
      typeof this.userAccount === 'string' &&
      this.password &&
      typeof this.password === 'string' &&
      this.accountType &&
      typeof this.accountType === 'string'
    );
  }

  async authenticate() {

    if (!this.isValid){
      return false;
    } else {
      const { rows } = await query(loginQuery, [
        this.userAccount,
        this.password,
        this.accountType,
      ]);

      if (rows.length === 0) {
        return false; // login failed
      }

      const hashedPassword = rows[0].password;

      const match = await bcrypt.compare(this.password, hashedPassword);
      return match
    }
  }
}
