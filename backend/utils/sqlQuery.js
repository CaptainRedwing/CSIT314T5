
// User Account CRUDS and Login
export const createRoleQuery = `
    CREATE TYPE profileType AS
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
        profile_id INT REFERENCES user_profile_details(id) ON DELETE SET NULL,
        is_active BOOLEAN
    );
`;


export const createUserAccountQuery = `
    INSERT INTO user_account_details(username, email, password, profile_id, is_active)
    VALUES($1, $2, $3, $4, $5) RETURNING *;
`;

export const viewUserAccountQuery = `SELECT * FROM user_account_details`;

export const loginQuery = ` SELECT * FROM user_account_details WHERE username=$1 AND profile_id =$2`;

export const updateUserAccountQuery = `
    UPDATE user_account_details
    SET
    username = COALESCE($1, username),
    email = COALESCE($2, email),
    password = COALESCE($3, password),
    profile_id = COALESCE($4, profile_id),
    is_active = CASE
    WHEN is_active = true AND $5 = false THEN is_active
    ELSE COALESCE($5, is_active)
    END
    WHERE id = $6
    RETURNING *
`;

export const findSpecificUserAccountQuery = `
    SELECT * FROM user_account_details 
    WHERE id = $1;
`;

export const suspendUserAccountQuery = `
    UPDATE user_account_details
    SET
    is_active = false
    WHERE id = $1;
`;

export const viewAccountByUserNameRoleQuery = `
    SELECT * FROM user_account_details
    WHERE
        (username = $1 OR $1 IS NULL) 
        AND 
        (profile_id = $2 OR $2 IS NULL)
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
    is_active = CASE
    WHEN is_active = true AND $3 = false THEN is_active
    ELSE COALESCE($3, is_active)
    END
    WHERE id = $4
    RETURNING *
`;

export const suspendUserProfileQuery = `
    UPDATE user_profile_details
    SET
    is_active = false
    WHERE id = $1;
`;

export const searchUserProfileQuery = `
    SELECT * FROM user_profile_details
    WHERE name = $1;
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
    WHERE name = $1;
`;


// Service Listing CRUDS
export const createServiceListingTableQuery = `
    CREATE TABLE IF NOT EXISTS service_listing_details(
    id SERIAL PRIMARY KEY,
    cleaner_id INT REFERENCES user_account_details(id) ON DELETE SET NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(50) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    location VARCHAR(50) NOT NULL,
    is_active BOOLEAN
    );
`;

export const createServiceListingQuery = `
    INSERT INTO service_listing_details(cleaner_id, title, description, price, location, is_active)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *;
`;

export const viewServiceListingQuery = `
    SELECT * FROM service_listing_details;
`;

export const updateServiceListingQuery = `
    UPDATE service_listing_details
    SET
    cleaner_id = COALESCE($1, cleaner_id),
    title = COALESCE($2, title),
    description = COALESCE($3, description),
    price = COALESCE($4, price),
    location = COALESCE($5, location),
    is_active = CASE
    WHEN is_active = true AND $6 = false THEN is_active
    ELSE COALESCE($6, is_active)
    END
    WHERE id = $7
    RETURNING *
`;

export const suspendServiceListingQuery = `
    UPDATE service_listing_details
    SET
    is_active = false
    WHERE id = $1;
`;

export const searchServiceListingQuery = `
    SELECT * FROM service_listing_details
    WHERE title = $1;
`;


export const roleCheckingTriggerAndTriggerFunction = `
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'trg_check_cleaner_role'
        ) THEN
            DROP TRIGGER trg_check_cleaner_role ON service_listing_details;
        END IF;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END
    $$;

    DROP FUNCTION IF EXISTS ensure_cleaner_role() CASCADE;

    CREATE OR REPLACE FUNCTION ensure_cleaner_role()
    RETURNS TRIGGER AS $$
    DECLARE
        role_name role_type;
    BEGIN
        SELECT upd.name
        INTO role_name
        FROM user_account_details uad
        JOIN user_profile_details upd ON uad.profile_id = upd.id
        WHERE uad.id = NEW.cleaner_id;
        IF role_name IS DISTINCT FROM 'Cleaner' THEN
            RAISE EXCEPTION 'User with ID % does not have the Cleaner role.', NEW.cleaner_id;
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_check_cleaner_role
    BEFORE INSERT ON service_listing_details
    FOR EACH ROW
    EXECUTE FUNCTION ensure_cleaner_role();
`;