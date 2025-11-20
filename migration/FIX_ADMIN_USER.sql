-- Promote user to staff and admin
DO $$
DECLARE
    v_user_email TEXT := 'mathew_lazo_guerra@hotmail.com';
    v_user_id UUID;
    v_role_id UUID;
BEGIN
    -- 1. Get User ID from auth.users
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email;

    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User % not found in auth.users', v_user_email;
        RETURN;
    END IF;

    -- 2. Ensure Admin Role exists
    INSERT INTO staff_roles (name, permissions, description)
    VALUES ('Admin', '{"all": true}', 'Administrator with full access')
    ON CONFLICT (name) DO UPDATE SET permissions = '{"all": true}'
    RETURNING id INTO v_role_id;

    -- 3. Insert or Update Staff
    INSERT INTO staff (id, role_id, first_name, last_name, is_active)
    VALUES (v_user_id, v_role_id, 'Mathew', 'Lazo', true)
    ON CONFLICT (id) DO UPDATE
    SET role_id = v_role_id, is_active = true;

    RAISE NOTICE 'User % promoted to Admin Staff', v_user_email;
END $$;
