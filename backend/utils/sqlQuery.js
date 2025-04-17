export const createAccountTypeQuery = `
    CREATE TYPE role_type AS
    ENUM ('UserAdmin','UserProfile','Cleaner','Homeowner','PlatformManager');
`


export const createUserTableQuery = `
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        user_account VARCHAR(20) NOT NULL,
        password VARCHAR(20) NOT NULL,
        role role_type NOT NULL DEFAULT 'UserAdmin'
    );
`

export const getUserAdminQuery = ` Select * FROM users WHERE role = 'UserAdmin'`;

export const getUserProfileQuery = ` Select * FROM users WHERE role = 'UserProfile'`;

export const getCleanerQuery = ` Select * FROM users WHERE role = 'Cleaner'`;

export const getHomeownerQuery = ` Select * FROM users WHERE role = 'Homeowner'`;

export const getPlatformManagerQuery = ` Select * FROM users WHERE role = 'PlatformManager'`;

export const createUserQuery = `
    INSERT INTO users(user_account,password,role)
    VALUES($1,$2,COALESCE($3::role_type,'UserAdmin'::role_type)) RETURNING *
`


export const loginQuery = ` SELECT * FROM users WHERE user_account=$1 AND password=$2 AND role=$3`;