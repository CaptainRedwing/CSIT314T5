// Drop all tables
export const dropAllTableQuery = `
DO $$
DECLARE
    tbl TEXT;
BEGIN
    -- Drop all tables
    FOR tbl IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(tbl) || ' CASCADE';
    END LOOP;
END
$$;

`;

//Drop All type
export const dropTypeQuery = `
DO $$
DECLARE
    typ TEXT;
BEGIN
    -- Drop all user-defined types
    FOR typ IN
        SELECT t.typname
        FROM pg_type t
        LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid))
          AND NOT EXISTS (
              SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid
          )
          AND n.nspname = 'public'
          AND t.typname NOT LIKE '_%' -- skip array types
          AND t.typcategory NOT IN ('A', 'P', 'B') -- skip arrays, pseudo, base types
    LOOP
        EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(typ) || ' CASCADE';
    END LOOP;
END
$$;

`

// User Account CRUDS and Login
export const createRoleQuery = `
    CREATE TYPE profile_type AS
    ENUM ('UserAdmin','Cleaner','Homeowner','PlatformManager', 'Pending');
`;

export const getAllrole = `
    SELECT enumlabel AS role 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'profile_type'
    ORDER BY enumlabel;
`;

export const createUserAccountTableQuery = `
    CREATE TABLE IF NOT EXISTS user_account (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(200) NOT NULL,
        profile_id INT REFERENCES user_profile(id) ON DELETE SET NULL,
        is_active BOOLEAN,
        time_stamp DATE DEFAULT CURRENT_DATE
    );
`;

export const createUserAccountQuery = `
    INSERT INTO user_account(username, email, password, profile_id, is_active, time_stamp)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *;
`;

export const viewUserAccountQuery = `SELECT * FROM user_account`;

export const loginQuery = `SELECT * FROM user_account WHERE username=$1 AND profile_id =$2`;

export const updateUserAccountQuery = `
    UPDATE user_account
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
    SELECT * FROM user_account 
    WHERE id = $1;
`;

export const suspendUserAccountQuery = `
    UPDATE user_account
    SET
    is_active = false
    WHERE id = $1;
`;

export const viewAccountByUserNameRoleQuery = `
    SELECT * FROM user_account
    WHERE
        (username ILIKE '%' || $1 || '%' OR $1 IS NULL) 
        AND 
        (profile_id = $2 OR $2 IS NULL);
`;

// User Profile CRUDS
export const createUserProfileTableQuery = `
    CREATE TABLE IF NOT EXISTS user_profile(
        id SERIAL PRIMARY KEY,
        name profile_type NOT NULL DEFAULT 'Pending',
        description VARCHAR(100) NOT NULL,
        is_active BOOLEAN
    );
`;

export const createUserProfileQuery = `
    INSERT INTO user_profile(name, description, is_active)
    VALUES(COALESCE($1::profile_type, 'Pending'::profile_type), $2, $3) RETURNING *
`;

export const viewUserProfileQuery = `
    SELECT * FROM user_profile;
`;

export const updateUserProfileQuery = `
    UPDATE user_profile
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
    UPDATE user_profile
    SET
    is_active = false
    WHERE id = $1;
`;

export const searchUserProfileQuery = `
    SELECT * FROM user_profile WHERE name::text ILIKE '%' || $1 || '%';
`;



export const viewProfileByIdQuery = `
    SELECT * FROM user_profile
    WHERE id = $1;
`;

// Service Categories CRUDS
export const createServiceCategoriesTableQuery = `
    CREATE TABLE IF NOT EXISTS service_categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(100) NOT NULL
    );
`;

export const createServiceCategoriesQuery = `
    INSERT INTO service_categories(name, description)
    VALUES($1, $2) RETURNING *;
`;

export const viewServiceCategoriesQuery = `
    SELECT * FROM service_categories;
`;

export const updateServiceCategoriesQuery = `
    UPDATE service_categories
    SET
    name = COALESCE($1, name),
    description = COALESCE($2, name)
    WHERE id = $3
    RETURNING *;
`;

export const deleteServiceCategoriesQuery = `
    DELETE FROM service_categories
    WHERE id = $1;
`;

export const searchServiceCategoriesQuery = `
    SELECT * FROM service_categories WHERE name::text ILIKE '%' || $1 || '%';
`;

export const viewServiceCategoryByIdQuery = `
    SELECT * FROM service_categories
    WHERE id = $1;
`;

// Service Listing CRUDS
export const createServiceListingTableQuery = `
    CREATE TABLE IF NOT EXISTS service_listing(
    id SERIAL PRIMARY KEY,
    cleaner_id INT REFERENCES user_account(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description VARCHAR(500) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    location VARCHAR(500) NOT NULL,
    view_count INTEGER DEFAULT 0,
    listed_count INTEGER DEFAULT 0,
    service_categories_name VARCHAR REFERENCES service_categories(name) ON DELETE SET NULL,
    created_at DATE DEFAULT CURRENT_DATE
    );
`;

export const createServiceListingQuery = `
    INSERT INTO service_listing(cleaner_id, title, description, price, location, view_count, listed_count, service_categories_name, created_at)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
`;


export const viewServiceListingQuery = `
    SELECT * FROM service_listing;
`;

export const updateServiceListingQuery = `
    UPDATE service_listing
    SET
    cleaner_id = COALESCE($1, cleaner_id),
    title = COALESCE($2, title),
    description = COALESCE($3, description),
    price = COALESCE($4, price),
    location = COALESCE($5, location),
    service_categories_name = COALESCE($6, service_categories_name)
    WHERE id = $7
    RETURNING *
`;

export const deleteServiceListingQuery = `
    DELETE FROM service_listing 
    WHERE id = $1;
`;

export const searchServiceListingQuery = `
     SELECT * FROM service_listing WHERE title::text ILIKE '%' || $1 || '%';
`;

export const viewServiceListingByIdQuery = `
    SELECT * FROM service_listing
    WHERE id = $1;
`;

export const cleanerCheckingTriggerAndTriggerFunction = `
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'trg_check_cleaner_role'
        ) THEN
            DROP TRIGGER trg_check_cleaner_role ON service_listing;
        END IF;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END
    $$;

    DROP FUNCTION IF EXISTS ensure_cleaner_role() CASCADE;

    CREATE OR REPLACE FUNCTION ensure_cleaner_role()
    RETURNS TRIGGER AS $$
    DECLARE
        role_name profile_type;
    BEGIN
        -- Get the cleaner's profile role based on profile_id
        SELECT upd.name
        INTO role_name
        FROM user_account uad
        JOIN user_profile upd ON uad.profile_id = upd.id
        WHERE uad.id = NEW.cleaner_id;  -- Check the cleaner's role for the inserted service listing

        -- Check if the role is 'Cleaner'
        IF role_name IS DISTINCT FROM 'Cleaner' THEN
            RAISE EXCEPTION 'User with ID % does not have the Cleaner role.', NEW.cleaner_id;
        END IF;

        -- Return the new row for insertion
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_check_cleaner_role
    BEFORE INSERT ON service_listing
    FOR EACH ROW
    EXECUTE FUNCTION ensure_cleaner_role();
`;

export const incrementViewCountQuery = `
    UPDATE service_listing
    SET
    view_count = view_count + 1
    WHERE id = $1
    RETURNING view_count;
`;

export const getViewCountQuery = `
    SELECT view_count
    FROM service_listing
    WHERE id = $1;
`;

export const incrementListedCountQuery = `
    UPDATE service_listing
    SET
    listed_count = listed_count + 1
    WHERE id = $1
    RETURNING listed_count;
`;

export const getListedCountQuery = `
    SELECT listed_count
    FROM service_listing
    WHERE id = $1;
`;

// Favourite Listing CRUDS
export const createFavouriteListingTableQuery = `
    CREATE TABLE IF NOT EXISTS favourite_listing(
        id SERIAL PRIMARY KEY,
        homeowner_id INT REFERENCES user_account(id) ON DELETE SET NULL,
        service_listing_id INT REFERENCES service_listing(id) ON DELETE SET NULL,
        added_at DATE DEFAULT CURRENT_DATE
    );
`;

export const saveFavouriteListingQuery = `
    INSERT INTO favourite_listing(homeowner_id, service_listing_id, added_at)
    VALUES($1, $2, $3) RETURNING *;
`;

export const viewFavouriteListingQuery = `
    SELECT * FROM favourite_listing;
`;

export const searchFavouriteListingQuery = `
    SELECT * FROM favourite_listing
    WHERE id = $1;
`;

export const homeownerCheckingTriggerAndTriggerFunction = `
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'trg_check_homeowner_role'
        ) THEN
            DROP TRIGGER trg_check_homeowner_role ON favourite_listing;
        END IF;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END
    $$;

    DROP FUNCTION IF EXISTS ensure_homeowner_role() CASCADE;

    CREATE OR REPLACE FUNCTION ensure_homeowner_role()
    RETURNS TRIGGER AS $$
    DECLARE
        role_name profile_type;
    BEGIN
        -- Get the homeowner's profile role based on profile_id
        SELECT upd.name
        INTO role_name
        FROM user_account uad
        JOIN user_profile upd ON uad.profile_id = upd.id
        WHERE uad.id = NEW.homeowner_id;  -- Check the homeowner's role for the inserted favourite listing

        -- Check if the role is 'Homeowner'
        IF role_name IS DISTINCT FROM 'Homeowner' THEN
            RAISE EXCEPTION 'User with ID % does not have the Homeowner role.', NEW.homeowner_id;
        END IF;

        -- Return the new row for insertion
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_check_homeowner_role
    BEFORE INSERT ON favourite_listing
    FOR EACH ROW
    EXECUTE FUNCTION ensure_homeowner_role();
`;


//Match History
export const createMatchHistoryTableQuery = `
    CREATE TABLE IF NOT EXISTS match_history(
    id SERIAL PRIMARY KEY,
    service_listing_id INT REFERENCES service_listing(id) ON DELETE SET NULL,
    homeowner_id INT REFERENCES user_account(id) ON DELETE SET NULL,
    date_confirmed DATE DEFAULT CURRENT_DATE,
    service_date DATE DEFAULT CURRENT_DATE,
    status BOOLEAN 
    );
`;

export const cleanerViewMatchHistoryQuery = `
    SELECT 
        mh.id,
        mh.service_listing_id,
        mh.homeowner_id,
        mh.date_confirmed,
        mh.service_date,
        mh.status
    FROM match_history mh
    JOIN service_listing sl
        ON mh.service_listing_id = sl.id
    WHERE sl.cleaner_id = $1
    AND mh.status = true
    ORDER BY date_confirmed DESC;
`;

export const cleanerSearchMatchHistoryQuery = `
    SELECT 
        mh.id,
        mh.service_listing_id,
        mh.homeowner_id,
        mh.date_confirmed,
        mh.service_date,
        mh.status
    FROM match_history mh
    JOIN service_listing sl
        ON mh.service_listing_id = sl.id
    WHERE sl.title = $1;
`;

export const homeownerSearchMatchHistoryQuery = `
    SELECT * 
    FROM match_history mh
    JOIN service_listing sl
        ON mh.service_listing_id = sl.id
    WHERE mh.homeowner_id = $1;
`;

export const homeownerViewMatchHistoryQuery = `
    SELECT * 
    FROM match_history mh
    JOIN service_listing sl
        ON mh.service_listing_id = sl.id
    WHERE mh.homeowner_id = $1 
    AND mh.status = true
    ORDER BY date_confirmed DESC;
`;

// US 30
export const cleanerViewPageAttributes = `
    SELECT 
        sl.title, 
        mh.service_date,
        mh.homeowner_id,
        sl.description,
        sl.price
    FROM service_listing sl
    JOIN match_history mh 
        ON mh.service_listing_id = sl.id
    WHERE sl.id = $1;
`;

// US 31
export const cleanerSearchPageAttributes = `
    SELECT
        mh.service_listing_id,
        sl.title,
        sl.service_categories_name,
        sl.price
    FROM service_listing sl
    JOIN match_history mh
        ON mh.service_listing_id = sl.id
    WHERE sl.title::text ILIKE '%' || $1 || '%';
`;

// US 32
export const homeownerViewMatchHistoryAttributes = `
    SELECT
        sl.title,
        sl.cleaner_id,
        sl.description,
        sl.price
    FROM service_listing sl
    JOIN match_history mh
        ON mh.service_listing_id = sl.id
    WHERE sl.id = $1;
`;

// US 31
export const homeownerSearchMatchHistoryAttributes= `
    SELECT
        sl.title,
        sl.service_categories_name,
        sl.price
    FROM service_listing sl
    JOIN match_history mh
        ON mh.service_listing_id = sl.id
    WHERE sl.title::text ILIKE '%' || $1 || '%';
`

// Report
export const createReportType = `
    CREATE TYPE report_type AS
    ENUM('Daily', 'Weekly', 'Monthly');
`;

export const viewReportAttributeQuery = `
    SELECT * FROM report;
`

export const createReportTableQuery = `
    CREATE TABLE IF NOT EXISTS report(
    id SERIAL PRIMARY KEY,
    date_of_report DATE DEFAULT CURRENT_DATE,
    type_of_report report_type NOT NULL DEFAULT 'Daily',
    new_user INT NOT NULL DEFAULT 0,
    match_service INT NOT NULL DEFAULT 0,
    created_service INT NOT NULL DEFAULT 0,
    most_viewed_service INT NOT NULL DEFAULT 0,
    added_favourite INT NOT NULL DEFAULT 0
    );
`;

export const generateDailyReportQuery = `
    INSERT INTO report (date_of_report, type_of_report, new_user, match_service, created_service, most_viewed_service, added_favourite)
    SELECT
        $1::date AS date_of_report,
        'Daily' AS type_of_report,
        (
            SELECT COUNT(*) FROM user_account
            WHERE time_stamp = $1
        ) AS new_user,
        (
            SELECT COUNT(*) FROM match_history
            WHERE date_confirmed = $1
        ) AS match_service,
        (
            SELECT COUNT(*) FROM service_listing
            WHERE created_at = $1
        ) AS created_service,
        (
            SELECT COALESCE(id, 0) FROM service_listing
            ORDER BY view_count DESC
            LIMIT 1
        ) AS most_viewed_service,
        (
            SELECT COUNT(*) FROM favourite_listing
            WHERE added_at = $1
        ) AS added_favourite
    RETURNING *;
`;

export const generateWeeklyReportQuery = `
INSERT INTO report (
    date_of_report,
    type_of_report,
    new_user,
    match_service,
    created_service,
    most_viewed_service,
    added_favourite
)
SELECT
    $1::date AS date_of_report,
    'Weekly' AS type_of_report,
    (
        SELECT COUNT(*) FROM user_account
        WHERE time_stamp >= $1::date AND time_stamp <= $1::date + INTERVAL '6 days'
    ) AS new_user,
    (
        SELECT COUNT(*) FROM match_history
        WHERE date_confirmed >= $1::date AND date_confirmed <= $1::date + INTERVAL '6 days'
    ) AS match_service,
    (
        SELECT COUNT(*) FROM service_listing
        WHERE created_at >= $1::date AND created_at <= $1::date + INTERVAL '6 days'
    ) AS created_service,
    (
        SELECT id FROM service_listing
        ORDER BY view_count DESC
        LIMIT 1
    ) AS most_viewed_service,
    (
        SELECT COUNT(*) FROM favourite_listing
        WHERE added_at >= $1::date AND added_at <= $1::date + INTERVAL '6 days'
    ) AS added_favourite
RETURNING *;
`;


export const generateMonthlyReportQuery = `
    INSERT INTO report (date_of_report, type_of_report, new_user, match_service, created_service, most_viewed_service, added_favourite)
    SELECT
        $1::date AS date_of_report,
        'Monthly' AS type_of_report,
        (
            SELECT COUNT(*) FROM user_account
            WHERE time_stamp >= date_trunc('month', $1) AND time_stamp < date_trunc('month', $1) + INTERVAL '1 month'
        ) AS new_user,
        (
            SELECT COUNT(*) FROM match_history
            WHERE date_confirmed >= date_trunc('month', $1) AND date_confirmed < date_trunc('month', $1) + INTERVAL '1 month'
        ) AS match_service,
        (
            SELECT COUNT(*) FROM service_listing
            WHERE created_at >= date_trunc('month', $1) AND created_at < date_trunc('month', $1) + INTERVAL '1 month'
        ) AS created_service,
        (
            SELECT COALESCE(id, 0) FROM service_listing
            ORDER BY view_count DESC
            LIMIT 1
        ) AS most_viewed_service,
        (
            SELECT COUNT(*) FROM favourite_listing
            WHERE added_at >= date_trunc('month', $1) AND added_at < date_trunc('month', $1) + INTERVAL '1 month'
        ) AS added_favourite
    RETURNING *;
`;


export const countNewUserQuery = `
    SELECT COUNT(*) AS no_of_new_users
    FROM user_account
    WHERE
    ($1 = 'Daily' AND time_stamp = $2)
    OR
    ($1 = 'Weekly' AND time_stamp >= $2 AND time_stamp <= $2 + INTERVAL '6 days')
    OR
    ($1 = 'Monthly' AND time_stamp >= date_trunc('month', $2) AND time_stamp < date_trunc('month', $2) + INTERVAL '1 month');
`;

export const countMatchServiceQuery = `
    SELECT COUNT(*) AS no_of_match_service
    FROM match_history
    WHERE
    ($1 = 'Daily' AND date_confirmed = $2)
    OR
    ($1 = 'Weekly' AND date_confirmed >= $2 AND date_confirmed <= $2 + INTERVAL '6 days')
    OR
    ($1 = 'Monthly' AND date_confirmed >= date_trunc('month', $2) AND date_confirmed < date_trunc('month', $2) + INTERVAL '1 month');
`;

export const countCreatedListingQuery = `
    SELECT COUNT(*) AS no_of_created_service_listing
    FROM service_listing
    WHERE
    ($1 = 'Daily' AND created_at = $2)
    OR
    ($1 = 'Weekly' AND created_at >= $2 AND created_at <= $2 + INTERVAL '6 days')
    OR
    ($1 = 'Monthly' AND created_at >= date_trunc('month', $2) AND created_at < date_trunc('month', $2) + INTERVAL '1 month');
`;

export const mostViewedServiceListingQuery = `
    SELECT id, view_count AS most_viewed_service_listing
    FROM service_listing
    ORDER BY view_count DESC
    LIMIT 1;

`;

export const countAddedFavouriteQuery = `
    SELECT COUNT(*) AS no_of_added_favourite
    FROM favourite_listing
    WHERE
    ($1 = 'Daily' AND added_at = $2)
    OR
    ($1 = 'Weekly' AND added_at >= $2 AND added_at <= $2 + INTERVAL '6 days')
    OR
    ($1 = 'Monthly' AND added_at >= date_trunc('month', $2) AND added_at < date_trunc('month', $2) + INTERVAL '1 month');
`;