const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
});

const WorkbookSchema = new mongoose.Schema({
  workbookName: String, // Change to match the incoming data
  sheets: [String], // Change to match the incoming data
});

const SaveRowsDataSchema = new mongoose.Schema({
  selectedWorkbookName: String,
  selectedsheetName: String,
  headers: [String],
  rows: [[String]],
});

const EmployeeModel = mongoose.model("employees", EmployeeSchema);
const WorkbookModel = mongoose.model("workbooks", WorkbookSchema);
const SaveRowDataModel = mongoose.model("saverowsdata", SaveRowsDataSchema);

// Export both models
module.exports = { EmployeeModel, WorkbookModel, SaveRowDataModel };
