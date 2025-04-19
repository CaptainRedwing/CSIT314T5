export const createRoleQuery = `
    CREATE TYPE role_type AS
    ENUM ('UserAdmin','Cleaner','Homeowner','PlatformManager', 'Pending');
`;


export const createUserTableQuery = `
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        user_account VARCHAR(20) NOT NULL,
        role role_type Not NULL DEFAULT 'Pending'
    );
`;

export const createUserAccountTableQuery = `
    CREATE TABLE IF NOT EXISTS user_account_details (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(50) NOT NULL,
        role role_type NOT NULL DEFAULT 'Pending'
    );
`;


export const createUserAccountQuery = `
    INSERT INTO user_account_details(username, email, password, role)
    VALUES($1, $2, $3, COALESCE($4::role_type, 'Pending'::role_type)) RETURNING *
`;

export const viewUserAccountQuery = `SELECT * FROM user_account_details`;

export const createUserQuery = `
    INSERT INTO users(user_account,password,role)
    VALUES($1,$2,COALESCE($3::role_type,'UserAdmin'::role_type)) RETURNING *
`;


export const loginQuery = ` SELECT * FROM users WHERE user_account=$1 AND password=$2 AND role=$3`;

export const updateUserAccountQuery = `
    UPDATE user_account_details
    SET
    username = COALESCE($1, username),
    email = COALESCE($2, email),
    password = COALESCE($3, password),
    role = COALESCE($4, role)
    WHERE id = $5
    RETURNING *
`;

export const findSpecificUserAccountQuery = `
    SELECT * FROM user_account_details 
    WHERE id = $1
`;

export const suspendUserAccountQuery = `
    DELETE FROM user_account_details
    WHERE id = $1
`;