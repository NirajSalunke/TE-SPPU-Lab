// CRUD
// insert one
db.createCollection("Students");

db.Students.insertOne({ name: "Niraj", age: 21, branch: "CSE", grade: "A" });

// Insert Many
db.Students.insertMany([
  { name: "Manaswa", age: 21, branch: "CE", grade: "A+" },
  { name: "Kaushal", age: 21, branch: "ECE", grade: "A" },
]);

// read all students
db.Students.find();

// using logical operators
db.Students.find({ $and: [{ branch: "CSE" }, { grade: "A" }] });
db.Students.find({ $or: [{ branch: "CSE" }, { grade: "A" }] });

// update one

db.Students.updateOne({ name: "Piyush" }, { $set: { grade: "A+" } });

// if the match is for one only one will get updted else depends on function called update one or many.

db.Students.updateMany({ branch: "CSE" }, { $set: { status: "active" } });

// delete
db.Students.deleteOne({ name: "Piyush" });

// delete many

db.Students.deleteMany({ branch: "ECE" });
