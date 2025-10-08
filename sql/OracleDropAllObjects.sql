DECLARE
    v_count NUMBER := 1;
BEGIN
    WHILE v_count > 0 LOOP
        v_count := 0;
        FOR obj IN (
            SELECT object_name, object_type
            FROM user_objects
            WHERE object_type IN ('TABLE', 'VIEW', 'SEQUENCE', 'SYNONYM', 'PACKAGE', 'PROCEDURE', 'FUNCTION', 'TRIGGER', 'TYPE')
        ) LOOP
            BEGIN
                EXECUTE IMMEDIATE 'DROP ' || obj.object_type || ' "' || obj.object_name || '" CASCADE CONSTRAINTS';
                v_count := v_count + 1;
            EXCEPTION
                WHEN OTHERS THEN
                    NULL; -- ignore errors (dependencies, etc.)
            END;
        END LOOP;
        
        -- Exit condition: when no more objects can be dropped
        EXIT WHEN v_count = 0;
    END LOOP;
END;
/