export const createAccountTypeQuery = `
    CREATE TYPE role_type AS
    ENUM ('UserAdmin','Cleaner','Homeowner','PlatformManager');
`;


export const createUserTableQuery = `
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        user_account VARCHAR(20) NOT NULL,
        password VARCHAR(20) NOT NULL,
        role role_type NOT NULL DEFAULT 'UserAdmin'
    );
`;

export const createUserAccountQuery = `
    CREATE TABLE user_account_details(
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        phone VARCHAR(20); 
    )
`;

export const getUserAccountQuery = ` SELECT username FROM user_account_details`;

export const createUserQuery = `
    INSERT INTO users(user_account,password,role)
    VALUES($1,$2,COALESCE($3::role_type,'UserAdmin'::role_type)) RETURNING *
`;


export const loginQuery = ` SELECT * FROM users WHERE user_account=$1 AND password=$2 AND role=$3`;
