DECLARE
   PROCEDURE drop_user_objects IS
   BEGIN
      FOR rec IN (SELECT object_name, object_type 
                  FROM user_objects 
                  WHERE object_type IN ('TABLE', 'VIEW', 'INDEX', 'SEQUENCE', 'PROCEDURE', 'FUNCTION', 'PACKAGE', 'TRIGGER', 'SYNONYM')) 
      LOOP
         BEGIN
            EXECUTE IMMEDIATE 'DROP ' || rec.object_type || ' ' || rec.object_name;
         EXCEPTION
            WHEN OTHERS THEN
               DBMS_OUTPUT.PUT_LINE('Failed to drop ' || rec.object_type || ' ' || rec.object_name || ': ' || SQLERRM);
         END;
      END LOOP;
   END drop_user_objects;
BEGIN
   drop_user_objects;
   -- Reclaim space in the user-specific tablespace
   EXECUTE IMMEDIATE 'ALTER TABLESPACE your_tablespace COALESCE';
END;
/