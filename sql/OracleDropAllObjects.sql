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




DECLARE
  v_dropped     NUMBER;
  v_curr_count  NUMBER;
  v_iterations  NUMBER := 0;
  v_max_iter    CONSTANT PLS_INTEGER := 100; -- safety limit
BEGIN
  LOOP
    v_dropped := 0;

    -- 1) Drop all foreign key constraints first
    FOR fk IN (
      SELECT table_name, constraint_name
      FROM   user_constraints
      WHERE  constraint_type = 'R'    -- Referential (FK)
    ) LOOP
      BEGIN
        EXECUTE IMMEDIATE 'ALTER TABLE "' || fk.table_name || '" DROP CONSTRAINT "' || fk.constraint_name || '"';
        v_dropped := v_dropped + 1;
        DBMS_OUTPUT.PUT_LINE('Dropped FK: ' || fk.constraint_name || ' on ' || fk.table_name);
      EXCEPTION WHEN OTHERS THEN
        NULL; -- ignore errors; we'll retry later
      END;
    END LOOP;

    -- 2) Drop other objects in a preferred order
    FOR obj IN (
      SELECT object_name, object_type
      FROM   user_objects
      WHERE  object_type IN (
               'MATERIALIZED VIEW','VIEW','TRIGGER',
               'FUNCTION','PROCEDURE',
               'PACKAGE BODY','PACKAGE',
               'TYPE BODY','TYPE',
               'SEQUENCE','SYNONYM','INDEX','TABLE'
             )
      -- prefer dropping things that usually have fewer outward dependencies first
      ORDER BY CASE object_type
                 WHEN 'MATERIALIZED VIEW' THEN 1
                 WHEN 'VIEW'             THEN 2
                 WHEN 'TRIGGER'          THEN 3
                 WHEN 'FUNCTION'         THEN 4
                 WHEN 'PROCEDURE'        THEN 5
                 WHEN 'PACKAGE BODY'     THEN 6
                 WHEN 'PACKAGE'          THEN 7
                 WHEN 'TYPE BODY'        THEN 8
                 WHEN 'TYPE'             THEN 9
                 WHEN 'SEQUENCE'         THEN 10
                 WHEN 'SYNONYM'          THEN 11
                 WHEN 'INDEX'            THEN 12
                 WHEN 'TABLE'            THEN 13
                 ELSE 99
               END
    ) LOOP
      BEGIN
        IF obj.object_type = 'TABLE' THEN
          -- cascade constraints and purge (optional)
          EXECUTE IMMEDIATE 'DROP TABLE "' || obj.object_name || '" CASCADE CONSTRAINTS PURGE';
        ELSIF obj.object_type = 'INDEX' THEN
          EXECUTE IMMEDIATE 'DROP INDEX "' || obj.object_name || '"';
        ELSIF obj.object_type = 'PACKAGE BODY' THEN
          EXECUTE IMMEDIATE 'DROP PACKAGE BODY "' || obj.object_name || '"';
        ELSIF obj.object_type = 'PACKAGE' THEN
          EXECUTE IMMEDIATE 'DROP PACKAGE "' || obj.object_name || '"';
        ELSIF obj.object_type = 'TYPE BODY' THEN
          EXECUTE IMMEDIATE 'DROP TYPE BODY "' || obj.object_name || '"';
        ELSE
          -- this covers: MATERIALIZED VIEW, VIEW, TRIGGER, FUNCTION, PROCEDURE, TYPE, SEQUENCE, SYNONYM
          EXECUTE IMMEDIATE 'DROP ' || obj.object_type || ' "' || obj.object_name || '"';
        END IF;

        v_dropped := v_dropped + 1;
        DBMS_OUTPUT.PUT_LINE('Dropped ' || obj.object_type || ' ' || obj.object_name);
      EXCEPTION WHEN OTHERS THEN
        NULL; -- ignore and try again on next pass
      END;
    END LOOP;

    -- how many objects remain
    SELECT COUNT(*) INTO v_curr_count FROM user_objects;

    v_iterations := v_iterations + 1;
    EXIT WHEN v_curr_count = 0 OR v_dropped = 0 OR v_iterations >= v_max_iter;
  END LOOP;

  IF v_curr_count = 0 THEN
    DBMS_OUTPUT.PUT_LINE('All objects dropped in ' || v_iterations || ' iteration(s).');
  ELSE
    RAISE_APPLICATION_ERROR(-20001,
      'Cleanup stopped after ' || v_iterations || ' iteration(s). Remaining objects: ' || v_curr_count);
  END IF;
END;
/