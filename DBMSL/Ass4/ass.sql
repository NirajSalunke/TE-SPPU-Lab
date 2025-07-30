DROP PROCEDURE IF EXISTS calculateCircleAreas;
DROP TABLE IF EXISTS Circle;
DROP TABLE IF EXISTS procedure_log;

CREATE TABLE Circle(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    radius INT NOT NULL,
    area DOUBLE NOT NULL
);

CREATE TABLE procedure_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    log_message VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //

CREATE PROCEDURE calculateCircleAreas(IN start_radius INT, IN end_radius INT)
BEGIN
    DECLARE area_val DOUBLE;
    DECLARE rad INT;
    DECLARE error_message VARCHAR(500);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            error_message = MESSAGE_TEXT;
            
        INSERT INTO procedure_log(log_message) VALUES (CONCAT('An SQL error occurred: ', error_message));
    END;

    IF start_radius > end_radius THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Start radius cannot be greater than end radius.';
    END IF;

    IF start_radius <= 0 OR end_radius <= 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Radius values cannot be zero or negative.';
    END IF;
    SET rad = start_radius;

    label1: LOOP
        SET area_val = 3.14 * rad * rad;
        
        INSERT INTO Circle(radius, area) VALUES (rad, area_val);
        
        SET rad = rad + 1;
        
        IF rad > end_radius THEN 
            LEAVE label1;
        END IF;
    END LOOP label1;
END;
//

DELIMITER ;

CALL calculateCircleAreas(5, 9);

-- CALL calculateCircleAreas(10, 5);
-- CALL calculateCircleAreas(-1, 5);

SELECT * FROM Circle;
SELECT * FROM procedure_log;
