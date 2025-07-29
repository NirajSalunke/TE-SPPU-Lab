-- Assignment 4

CREATE TABLE Circle(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    radius INT NOT NULL,
    area DOUBLE NOT NULL
);

DELIMITER //

CREATE PROCEDURE calAreasFrom5to9()
BEGIN
    DECLARE area_val DOUBLE;
    DECLARE rad INT DEFAULT 5;

    label1: LOOP
        SET area_val = 3.14 * rad * rad;
        INSERT INTO Circle(radius, area) VALUES (rad, area_val);
        SET rad = rad + 1;
        IF rad > 9 THEN 
            LEAVE label1;
        END IF;
    END LOOP label1;
END;
//

DELIMITER ;

CALL calAreasFrom5to9();






