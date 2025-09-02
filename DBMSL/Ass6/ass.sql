CREATE TABLE IF NOT EXISTS Student (
    rolNo INT PRIMARY KEY,
    nameSt VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS CopyStudent (
    rolNoA INT PRIMARY KEY,
    nameStA VARCHAR(100) NOT NULL
);

INSERT INTO
    Student (rolNo, nameSt)
VALUES (1, 'Alice'),
    (2, 'Bob'),
    (3, 'Charlie'),
    (4, 'David'),
    (5, 'Eve'),
    (6, 'Fiona'),
    (7, 'George'),
    (8, 'Hannah'),
    (9, 'Ian'),
    (10, 'Jane');

INSERT INTO
    CopyStudent (rolNoA, nameStA)
VALUES (1, 'Alice'),
    (2, 'Bob');

TRUNCATE CopyStudent;
DELIMITER;

DROP PROCEDURE IF EXISTS CopyDetails;

DELIMITER / /

DELIMITER / /

CREATE PROCEDURE CopyDetails()
BEGIN
    DECLARE roll INT;
    DECLARE nam VARCHAR(100);
    DECLARE done INT DEFAULT 0;

    DECLARE pointFirst CURSOR FOR 
        SELECT rolNo, nameSt FROM Student;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN pointFirst;

    readloop: LOOP
        FETCH pointFirst INTO roll, nam;
        IF done = 1 THEN
            LEAVE readloop;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM CopyStudent WHERE rolNoA = roll) THEN
            INSERT INTO CopyStudent (rolNoA, nameStA) VALUES (roll, nam);
            SELECT "Data is Entered:- " AS Message,roll AS RollNo,nam AS NameOfStudent;
        ELSE 
            SELECT "Data Already exists.." AS Message;
        END IF;

    END LOOP;

    CLOSE pointFirst;
END //

DELIMITER;

DELIMITER;


CALL CopyDetails;

TRUNCATE CopyStudent;
