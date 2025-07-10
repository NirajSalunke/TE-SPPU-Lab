

-- Assignment 3

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
(1001, 101, 'Website Redesign', 'Pune', 150000, '2020-01-01'),
(1002, 101, 'Database Migration', 'Bangalore', 300000, '2005-06-15'),
(1003, 102, 'Network Upgrade', 'Pune', 80000, '2006-03-20'),
(1004, 102, 'Security Audit', 'Hyderabad', 120000, '2007-09-10'),
(1005, 103, 'Recruitment Drive', 'Mumbai', 50000, '2020-02-01'),
(1006, 104, 'Annual Budgeting', 'Delhi', 200000, '2009-04-01'),
(1007, 105, 'New Product Launch', 'Pune', 450000, '2010-07-01'),
(1008, 101, 'Cloud Infrastructure', 'Chennai', 600000, '2011-01-01'),
(1009, 102, 'Software Development', 'Pune', 250000, '2004-11-01'),
(1010, 103, 'Employee Training', 'Kolkata', 75000, '2005-05-01'),
(1011, 101, 'Mobile App Development', 'Pune', 180000, '2007-03-01'),
(1012, 104, 'Financial Reporting System', 'Ahmedabad', 350000, '2020-08-01');


-- Answers

-- [1]. Find Employee details and Department details using NATURAL JOIN.
 SELECT * FROM
 Employee AS e JOIN Department d
 ON e.deptId = d.deptId;

-- [2]. Find the emp_fname,Emp_position,location,Emp_JoinDate who have same Dept id. -- doubt
 SELECT deptId, empFName, empPosition, empJoinDate
 FROM Employee
 ORDER BY deptId;

-- [3]. Find the Employee details ,Proj_id,Project cost who does not have Project location as ‘Hyderabad’.

 SELECT * from
 Employee e JOIN Project p
 ON e.deptId = p.deptId
 WHERE p.projLocation != 'Hyderabad' 
 ORDER BY p.projId;

-- [4]. Find Department Name ,employee name, Emp_position for which project year is 2020, 

 SELECT d.deptName, e.empFName, e.empPosition, YEAR(p.projYear), p.projName AS ProjectYear
 FROM Project p
 JOIN Department d ON p.deptId = d.deptId
 JOIN Employee e ON e.deptId = d.deptId
 WHERE YEAR(p.projYear) = 2020;

-- [5] Display emp_position,D_name who have Project cost >30000
SELECT e.empPosition, d.deptName, p.projCost FROM Employee e
JOIN Department d on e.deptId = d.deptId
JOIN Project p on p.deptId = d.deptId 
WHERE p.projCost > 30000; 

-- [6] Find the names of all the Projects that started in the year 2015.
SELECT p.projName as Project_Name FROM Project p WHERE YEAR(p.projYear) = 2015;

-- [7] List the Dept_name having no_of_emp = 10
SELECT d.deptName, COUNT(e.empId) FROM Employee e JOIN Department d ON e.deptId = d.deptId GROUP BY d.deptName HAVING COUNT(e.empID) = 10;

-- [8] .Display the total number of employee who have joined any project before 2009
SELECT e.empFName, p.projName,e.empJoinDate, p.projYear FROM Employee e
JOIN Department d on e.deptId = d.deptId
JOIN Project p on p.deptId = d.deptId 
WHERE e.empJoinDate < p.projYear AND YEAR(projYear) < 2009; 

-- [9]. Create a view showing the employee and Department details.
CREATE VIEW emp_and_depart_data AS
SELECT 
    e.empId,
    e.empFName,
    e.deptId AS empDeptId,
    d.deptId AS deptDeptId,
    d.deptName
FROM Employee e
JOIN Department d ON e.deptId = d.deptId;

-- [10]. Perform Manipulation on simple view-Insert, update, delete, drop view.
DROP VIEW emp_and_depart_data;

