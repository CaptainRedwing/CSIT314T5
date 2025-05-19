import bcrypt from "bcrypt";
import { query } from "../utils/connectToDB.js";
import { loginQuery } from "../utils/sqlQuery.js";

export class LoginUser {
  constructor({ username, password, profile_id }) {
    this.username = username;
    this.password = password;
    this.profile_id = profile_id;
  }

  isValid() {
    return (
      this.username &&
      typeof this.username === 'string' &&
      this.profile_id &&
      typeof this.profile_id === 'string'
    );
  }

  async authenticate() {

    console.log('Authenticating with:', {
      username: this.username,
      profile_id: this.profile_id
    });

      const { rows } = await query(loginQuery, [
        this.username,
        this.profile_id
      ]);

      if (rows.length === 0) {
        return false; // login failed
      }

      const hashedPassword = rows[0].password;

      const match = await bcrypt.compare(this.password, hashedPassword);
      return match
  }

  static async getAllRoles() {
    const { rows } = await query()
  }
}
