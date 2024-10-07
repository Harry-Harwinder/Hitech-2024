const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  EmployeeModel,
  WorkbookModel,
  SaveRowDataModel,
} = require("./models/Employee"); // Updated import

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/employee", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error: ", err));

// Registration API
app.post("/register", (req, res) => {
  EmployeeModel.create(req.body)
    .then((employee) => res.json({ success: true, employee }))
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
});

// Workbooks API
app.post("/workbooks", (req, res) => {
  console.log("Received workbook data:", req.body); // Debugging line
  // Create a workbook using the incoming data with the correct keys
  WorkbookModel.create({
    workbookName: req.body.workbookName,
    sheets: req.body.sheets,
  })
    .then((workbook) => res.json({ success: true, workbook }))
    .catch((err) => {
      console.error("Error saving workbook:", err); // Debugging line
      res.status(500).json({ success: false, message: err.message });
    });
});

// Fetch all workbooks
app.get("/workbooks", (req, res) => {
  res.set("Cache-Control", "no-store");
  WorkbookModel.find({})
    .then((workbooks) => res.json({ success: true, workbooks }))
    .catch((err) => {
      console.error("Error fetching workbooks:", err);
      res.status(500).json({ success: false, message: err.message });
    });
});

// Example API endpoint to check if data exists
app.get("/api/check-data", async (req, res) => {
  const { workbookName, sheetName } = req.query;

  // Query the database to check if data exists for the given workbook and sheet
  const data = await SomeDatabaseModel.findOne({ workbookName, sheetName });

  if (data) {
    // Data exists, return chart data
    return res.json({ exists: true, chartData: data.chartData });
  } else {
    // No data available
    return res.json({ exists: false });
  }
});

// Save headers and rows data
app.post("/saverowsdata", (req, res) => {
  const { selectedWorkbookName, selectedsheetName, headers, rows } = req.body;

  SaveRowDataModel.create({
    selectedWorkbookName,
    selectedsheetName,
    headers,
    rows,
  })
    .then((savedData) => res.json({ success: true, savedData }))
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
});
// Fetch all workbooks
app.get("/saverowsdata", (req, res) => {
  SaveRowDataModel.find({})
    .then((savedData) => res.json({ success: true, savedData }))
    .catch((err) => {
      console.error("Error fetching savedData:", err);
      res.status(500).json({ success: false, message: err.message });
    });
});

// Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  EmployeeModel.findOne({ email: email, password: password })
    .then((employee) => {
      if (employee) {
        res.json({ success: true, message: "Login successful", employee });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
});

// Start the server
app.listen(3001, () => {
  console.log("Server is Running on port 3001");
});
