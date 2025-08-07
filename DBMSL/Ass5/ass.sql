DROP TABLE IF EXISTS Students;

DROP TABLE IF EXISTS Results;

CREATE TABLE Students (
    rollNo INT PRIMARY KEY CHECK (rollNo > 0),
    nameOfStud VARCHAR(500) NOT NULL,
    totalMarks BIGINT NOT NULL DEFAULT 0 
)

CREATE TABLE Results (
    studentId INT PRIMARY KEY,
    clas VARCHAR(500),
    FOREIGN KEY (studentId) REFERENCES Students (rollNo) ON DELETE CASCADE
)

DELIMITER ;

DROP PROCEDURE IF EXISTS proc_grade;
DELIMITER //

CREATE PROCEDURE proc_grade(IN roll INT)
BEGIN
    DECLARE marks BIGINT DEFAULT NULL;
    DECLARE nameStud VARCHAR(500) DEFAULT NULL;
    DECLARE clasI VARCHAR(500);
    DECLARE error_msg VARCHAR(500);
    DECLARE done BOOLEAN DEFAULT FALSE;


    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 error_msg = MESSAGE_TEXT;
        SELECT error_msg AS Message;
    END;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    IF roll <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid rollNo';
    END IF;


    SELECT totalMarks, nameOfStud INTO marks, nameStud FROM Students WHERE rollNo = roll;

    IF done THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student not found';
    END IF;

    IF marks > 1500 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid marks';
    END IF;

    IF marks >= 990 THEN
        SET clasI = 'Distinction';
    ELSEIF marks >= 900 THEN
        SET clasI = 'First Class';
    ELSEIF marks >= 825 THEN
        SET clasI = 'Higher Second Class';
    ELSE
        SET clasI = 'Fail';
    END IF;

    INSERT INTO Results(studentId, clas) VALUES (roll, clasI);

    SELECT 'Result Calculated Successfully' AS Message;
END;
//

DELIMITER ;

INSERT INTO
    Students (
        rollNo,
        NameOfStud,
        totalMarks
    )
VALUES (1, 'Alice', 995),
    (2, 'Bob', 920),
    (3, 'Charlie', 840),
    (4, 'David', 700),
    (5, 'Eva', 1501),
    (6, 'Frank', 990),
    (7, 'Frank', -1);

SELECT * FROM `Students`;
SELECT * FROM `Results`;                                                        


TRUNCATE TABLE `Results`;

CALL proc_grade(1);
CALL proc_grade(-2);
CALL proc_grade(3);
CALL proc_grade(4);
CALL proc_grade(5);
CALL proc_grade(10);

-- SELECT totalMarks FROM Students WHERE `rollNo` = 10;
