BEGIN
    -- Drop all views (ignore dependencies; invalidates dependent objects)
    FOR obj IN (SELECT view_name AS name FROM user_views) 
    LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP VIEW "' || obj.name || '"';
        EXCEPTION
            WHEN OTHERS THEN NULL; -- Ignore errors (e.g., already dropped)
        END;
    END LOOP;

    -- Drop all tables with CASCADE CONSTRAINTS PURGE
    FOR obj IN (SELECT table_name AS name FROM user_tables) 
    LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP TABLE "' || obj.name || '" CASCADE CONSTRAINTS PURGE';
        EXCEPTION
            WHEN OTHERS THEN NULL; -- Ignore errors
        END;
    END LOOP;

    -- Drop all sequences
    FOR obj IN (SELECT sequence_name AS name FROM user_sequences) 
    LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP SEQUENCE "' || obj.name || '"';
        EXCEPTION
            WHEN OTHERS THEN NULL; -- Ignore errors
        END;
    END LOOP;

    -- Drop all indexes (non-PK/UK; tables already dropped handle most)
    FOR obj IN (
        SELECT index_name AS name 
        FROM user_indexes 
        WHERE index_type != 'LOB' -- Exclude LOB indexes
          AND generated = 'N'    -- Exclude system-generated indexes (e.g., for PK/UK)
    )
    LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP INDEX "' || obj.name || '"';
        EXCEPTION
            WHEN OTHERS THEN NULL; -- Ignore errors
        END;
    END LOOP;
END;
/