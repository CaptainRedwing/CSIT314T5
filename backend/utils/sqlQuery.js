
// User Admin CRUDS and Login
export const createRoleQuery = `
    CREATE TYPE role_type AS
    ENUM ('UserAdmin','Cleaner','Homeowner','PlatformManager', 'Pending');
`;

export const getAllrole = `
    SELECT enumlabel AS role 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'role_type'
    ORDER BY enumlabel;
`;

export const createUserAccountTableQuery = `
    CREATE TABLE IF NOT EXISTS user_account_details (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(200) NOT NULL,
        role role_type NOT NULL DEFAULT 'Pending',
        user_profile_id INT REFERENCES user_profile_details(id) ON DELETE SET NULL
    );
`;


export const createUserAccountQuery = `
    INSERT INTO user_account_details(username, email, password, role, user_profile_id)
    VALUES($1, $2, $3, COALESCE($4::role_type, 'Pending'::role_type), $5) RETURNING *;
`;

export const viewUserAccountQuery = `SELECT * FROM user_account_details`;

export const loginQuery = ` SELECT * FROM user_account_details WHERE username=$1 AND role =$2`;

export const updateUserAccountQuery = `
    UPDATE user_account_details
    SET
    username = COALESCE($1, username),
    email = COALESCE($2, email),
    password = COALESCE($3, password),
    role = COALESCE($4, role),
    user_profile_id = COALESCE($5, user_profile_id)
    WHERE id = $6
    RETURNING *;
`;

export const findSpecificUserAccountQuery = `
    SELECT * FROM user_account_details 
    WHERE id = $1;
`;

export const suspendUserAccountQuery = `
    DELETE FROM user_account_details
    WHERE id = $1;
`;

export const viewAccountByUserNameRoleQuery = `
    SELECT * FROM user_account_details
    WHERE ($1::VARCHAR IS NULL OR username = $1)
    AND ($2::role_type IS NULL OR role = $2);
`;



// User Profile CRUDS
export const createUserProfileTableQuery = `
    CREATE TABLE IF NOT EXISTS user_profile_details(
        id SERIAL PRIMARY KEY,
        name role_type NOT NULL DEFAULT 'Pending',
        description VARCHAR(100) NOT NULL,
        is_active BOOLEAN
    );
`;

export const createUserProfileQuery = `
    INSERT INTO user_profile_details(name, description, is_active)
    VALUES(COALESCE($1::role_type, 'Pending'::role_type), $2, $3) RETURNING *
`;

export const viewUserProfileQuery = `
    SELECT * FROM user_profile_details;
`;

export const updateUserProfileQuery = `
    UPDATE user_profile_details
    SET
    name = COALESCE($1, name),
    description = COALESCE($2, description),
    is_active = COALESCE($3, is_active)
    WHERE id = $4
    RETURNING *
`;

export const suspendUserProfileQuery = `
    DELETE FROM user_profile_details
    WHERE id = $1;
`;

export const searchUserProfileQuery = `
    SELECT * FROM user_profile_details
    WHERE id = $1;
`;


// Service Categories CRUDS
export const createServiceCategoriesTableQuery = `
    CREATE TABLE IF NOT EXISTS service_categories_details(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(100) NOT NULL
    );
`;

export const createServiceCategoriesQuery = `
    INSERT INTO service_categories_details(name, description)
    VALUES($1, $2) RETURNING *;
`;

export const viewServiceCategoriesQuery = `
    SELECT * FROM service_categories_details;
`;

export const updateServiceCategoriesQuery = `
    UPDATE service_categories_details
    SET
    name = COALESCE($1, name),
    description = COALESCE($2, name)
    WHERE id = $3
    RETURNING *;
`;

export const deleteServiceCategoriesQuery = `
    DELETE FROM service_categories_details
    WHERE id = $1;
`;

export const searchServiceCategoriesQuery = `
    SELECT * FROM service_categories_details
    WHERE id = $1;
`;