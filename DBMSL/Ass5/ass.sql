DROP TABLE IF EXISTS Students;

DROP TABLE IF EXISTS Results;

CREATE TABLE Students (
    rollNo INT PRIMARY KEY,
    NameOfStud VARCHAR(500) NOT NULL,
    totalMarks BIGINT NOT NULL DEFAULT 0
)

CREATE TABLE Results (
    studentId INT PRIMARY KEY,
    clas VARCHAR(500),
    FOREIGN KEY (studentId) REFERENCES Students (rollNo) ON DELETE CASCADE
)

DELIMITER //

CREATE PROCEDURE proc_grade(IN roll INT)
BEGIN
    DECLARE marks BIGINT;
    DECLARE clasI VARCHAR(500);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Invalid marks' AS Message;
    END;

    SELECT totalMarks INTO marks FROM Students WHERE rollNo = roll;

    IF marks > 1500 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid marks';
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

    INSERT INTO Results(studentId, clas) VALUES(roll, clasI);

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
    (6, 'Frank', 990);

SELECT * FROM `Students`;
SELECT * FROM `Results`;                                                        


TRUNCATE TABLE `Results`;

CALL proc_grade(1);
CALL proc_grade(2);
CALL proc_grade(3);
CALL proc_grade(4);
CALL proc_grade(5);
CALL proc_grade(6);
