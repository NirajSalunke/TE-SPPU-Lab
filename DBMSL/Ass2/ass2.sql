

-- Assignment 2 DLL and DML



CREATE TABLE Department (
  deptId INT PRIMARY KEY,
  deptName NVARCHAR(100) NOT NULL,
  deptLocation NVARCHAR(100)
);

CREATE TABLE Employee (
    empId INT PRIMARY KEY,
    deptId INT,
    empFName NVARCHAR(100) NOT NULL, 
    empPosition NVARCHAR(100),       
    empSalary BIGINT NOT NULL DEFAULT 0,
    empJoinDate DATE NOT NULL DEFAULT (CAST(GETDATE() AS DATE)), 
    FOREIGN KEY (deptId) REFERENCES Department(deptId) ON DELETE CASCADE
);

CREATE TABLE Project(
  projId INT PRIMARY KEY,
  deptId INT,
  projName NVARCHAR(100) NOT NULL,
  projLocation NVARCHAR(100),
  projCost BIGINT NOT NULL DEFAULT 0,
  projYear date NOT NULL DEFAULT (CAST(GETDATE() AS DATE)),
  FOREIGN KEY (deptId) REFERENCES Department(deptId) ON DELETE CASCADE
);

-- Insert records into Department table
INSERT INTO Department (deptId, deptName, deptLocation) VALUES
(101, 'Computer', 'New York'),
(102, 'IT', 'London'),
(103, 'HR', 'Paris'),
(104, 'Finance', 'Tokyo'),
(105, 'Marketing', 'Sydney'),
(106, 'Operations', 'Berlin'),
(107, 'Research', 'San Francisco'),
(108, 'Sales', 'Dubai'),
(109, 'Legal', 'Rome'),
(110, 'Admin', 'Madrid');

-- Insert records into Employee table
INSERT INTO Employee (empId, deptId, empFName, empPosition, empSalary, empJoinDate) VALUES
(1, 101, 'Prateek', 'Software Engineer', 75000, '2000-03-15'),
(2, 101, 'Harsh', 'Data Scientist', 85000, '2002-07-22'),
(3, 102, 'Priya', 'Network Administrator', 60000, '2005-11-01'),
(4, 102, 'Rahul', 'IT Support', 45000, '2008-01-10'),
(5, 103, 'Heena', 'HR Manager', 90000, '1983-05-20'),
(6, 103, 'Preeti', 'HR Assistant', 40000, '2010-09-01'),
(7, 104, 'Parth', 'Financial Analyst', 70000, '1980-02-28'),
(8, 104, 'Hitesh', 'Accountant', 55000, '2012-04-12'),
(9, 105, 'Pooja', 'Marketing Specialist', 65000, '2015-06-01'),
(10, 105, 'Himanshu', 'Marketing Manager', 95000, '2018-08-01'),
(11, 101, 'Peter', 'Project Manager', 100000, '1984-11-11'),
(12, 102, 'Henry', 'System Analyst', 70000, '1990-03-25');


-- Insert records into Project table
INSERT INTO Project (projId, deptId, projName, projLocation, projCost, projYear) VALUES
(1001, 101, 'Website Redesign', 'Pune', 150000, '2004-01-01'),
(1002, 101, 'Database Migration', 'Bangalore', 300000, '2005-06-15'),
(1003, 102, 'Network Upgrade', 'Pune', 80000, '2006-03-20'),
(1004, 102, 'Security Audit', 'Hyderabad', 120000, '2007-09-10'),
(1005, 103, 'Recruitment Drive', 'Mumbai', 50000, '2008-02-01'),
(1006, 104, 'Annual Budgeting', 'Delhi', 200000, '2009-04-01'),
(1007, 105, 'New Product Launch', 'Pune', 450000, '2010-07-01'),
(1008, 101, 'Cloud Infrastructure', 'Chennai', 600000, '2011-01-01'),
(1009, 102, 'Software Development', 'Pune', 250000, '2004-11-01'),
(1010, 103, 'Employee Training', 'Kolkata', 75000, '2005-05-01'),
(1011, 101, 'Mobile App Development', 'Pune', 180000, '2007-03-01'),
(1012, 104, 'Financial Reporting System', 'Ahmedabad', 350000, '2007-08-01');


-- 2. Display all Employee details with Department ‘Computer’ and ‘IT’ and Employee first name starting with 'p' or 'h'.
SELECT E.*
FROM Employee E
JOIN Department D ON E.deptId = D.deptId
WHERE D.deptName IN ('Computer', 'IT')
  AND (E.empFName LIKE 'P%' OR E.empFName LIKE 'H%');

-- 3. lists the number of different Employee Positions.
SELECT COUNT(DISTINCT empPosition) AS NumberOfDifferentPositions
FROM Employee;

-- 4. Give 10% increase in Salary of the Employee whose joining year is before 1985.
SELECT empSalary,empJoinDate from Employee WHERE YEAR(empJoinDate) < 1985;

UPDATE Employee
SET empSalary = empSalary * 1.1
WHERE YEAR(empJoinDate) < 1985;

SELECT empSalary,empJoinDate from Employee WHERE YEAR(empJoinDate) < 1985;

-- 5. Delete Department details which location is ‘Mumbai’.
SELECT * FROM Department;

DELETE FROM Department
WHERE deptLocation = 'Mumbai';
 
SELECT * FROM Department;


-- 6. Find the names of Projects with location ‘pune’.
SELECT projName
FROM Project
WHERE projLocation = 'Pune';

-- 7. Find the project having cost in between 100000 to 500000.
SELECT *
FROM Project
WHERE projCost BETWEEN 100000 AND 500000;

-- 8. Find the project having maximum price and find average of Project cost

SELECT MAX(projCost) AS Max_Cost, AVG(projCost) AS Avg_Cost FROM Project;


-- 9. Display all employees with Emp _id and Emp name in decreasing order of Emp_lname (Assuming empFName is the name column)

SELECT empId, empFName
FROM Employee
ORDER BY empFName DESC;

-- 10. Display Proj_name, Proj_location, Proj_cost of all project started in 2004, 2005, 2007

SELECT projName, projLocation, projCost,projYear FROM Project WHERE (YEAR(projYear) IN (2004,2005,2007));

