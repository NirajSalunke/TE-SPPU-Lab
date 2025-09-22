db.createCollection("Students");
db.Students.insertMany([
  { name: "Niraj", age: 21, branch: "CSE", grade: "A" },
  { name: "Manaswa", age: 21, branch: "CE", grade: "A+" },
  { name: "Kaushal", age: 21, branch: "ECE", grade: "A" },
  { name: "Piyush", age: 22, branch: "CSE", grade: "B" },
  { name: "Asha", age: 20, branch: "CSE", grade: "A+" },
  { name: "Rohit", age: 22, branch: "ECE", grade: "B" },
]);

var mapFunction = function () {
  emit(this.branch, 1);
};

var reduceFunction = function (key, values) {
  return Array.sum(values);
};

db.Students.mapReduce(mapFunction, reduceFunction, { out: "branch_counts" });

db.branch_counts.find();
