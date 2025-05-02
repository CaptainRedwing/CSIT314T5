import bcrypt from "bcrypt";
import { query } from "../utils/connectToDB.js";
import { loginQuery } from "../utils/sqlQuery.js";

export class LoginUser {
  constructor({ username, password, role }) {
    this.username = username;
    this.password = password;
    this.role = role;
  }

  isValid() {
    return (
      this.username &&
      typeof this.username === 'string' &&
      this.role &&
      typeof this.role === 'string'
    );
  }

  async authenticate() {

    console.log('Authenticating with:', {
      username: this.username,
      role: this.role
    });

      const { rows } = await query(loginQuery, [
        this.username,
        this.role
      ]);

      if (rows.length === 0) {
        return false; // login failed
      }

      const hashedPassword = rows[0].password;

      const match = await bcrypt.compare(this.password, hashedPassword);
      return match
  }
}
