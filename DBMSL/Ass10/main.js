// --- Setup: example collections (if not already present) ---
db.createCollection("Students"); // if not already created
db.Students.insertMany([
  {
    _id: ObjectId(),
    name: "Niraj",
    age: 21,
    branch: "CSE",
    grade: "A",
    lastActive: new Date(),
  },
  { _id: ObjectId(), name: "Manaswa", age: 21, branch: "CE", grade: "A+" },
  { _id: ObjectId(), name: "Kaushal", age: 21, branch: "ECE", grade: "A" },
  { _id: ObjectId(), name: "Piyush", age: 22, branch: "CSE", grade: "B" },
  { _id: ObjectId(), name: "Asha", age: 20, branch: "CSE", grade: "A+" },
  { _id: ObjectId(), name: "Rohit", age: 22, branch: "ECE", grade: "B" },
]);

// A small Scores collection to demonstrate $lookup
db.createCollection("Scores");
db.Scores.insertMany([
  { studentName: "Niraj", subject: "DBMS", marks: 92 },
  { studentName: "Niraj", subject: "Algo", marks: 88 },
  { studentName: "Piyush", subject: "DBMS", marks: 65 },
  { studentName: "Asha", subject: "Algo", marks: 98 },
  { studentName: "Kaushal", subject: "Networks", marks: 85 },
]);

//Output: documents like { _id: "CSE", count: 3 }, etc.
db.Students.aggregate([
  { $group: { _id: "$branch", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);

// Average age per branch
db.Students.aggregate([
  { $group: { _id: "$branch", avgAge: { $avg: "$age" } } },
  { $project: { branch: "$_id", avgAge: { $round: ["$avgAge", 2] }, _id: 0 } },
]);

db.Students.createIndex({ name: 1 }); // ascending index on name

db.Students.getIndexes(); // show indexes

db.Students.createIndex({ name: "text", branch: "text" });
// Usage:
db.Students.find({ $text: { $search: "Niraj CSE" } });

db.Students.dropIndex({ name: 1 }); // drop by key spec
// or
db.Students.dropIndex("name_1"); // drop by index name
