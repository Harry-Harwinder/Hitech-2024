import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSignOutAlt, FaFileAlt } from "react-icons/fa";
import { Container, Table, Row, Col, Modal, Button } from "react-bootstrap";
import {
  Chart,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register necessary components with Chart.js
Chart.register(
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const getNextColumnLabel = (lastLabel) => {
  let newLabel = "";
  let carry = true;

  for (let i = lastLabel.length - 1; i >= 0; i--) {
    const charCode = lastLabel.charCodeAt(i);

    if (charCode === 90) {
      // 'Z'
      newLabel = "A" + newLabel;
    } else {
      newLabel = String.fromCharCode(charCode + 1) + newLabel;
      carry = false;
      break;
    }
  }

  if (carry) {
    newLabel = "A" + newLabel;
  }

  return lastLabel.length > 0
    ? lastLabel.slice(0, -newLabel.length) + newLabel
    : newLabel;
};
const dataStatic = {
  labels: [
    "15-Jan",
    "15-Feb",
    "15-Mar",
    "15-Apr",
    "15-May",
    "15-Jun",
    "15-Jul",
    "15-Aug",
    "15-Sep",
    "15-Oct",
    "15-Nov",
    "15-Dec",
  ],
  datasets: [
    {
      label: "Visit",
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(131,138,133,0.4)",
      borderColor: "rgba(131,138,133,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(131,138,133,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(131,138,133,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [100, 80, 130, 125, 150, 200, 190, 210, 170, 190, 220, 200],
    },
    {
      label: "Visit Trend (No Season)",
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(47,153,76,0.4)",
      borderColor: "rgba(47,153,76,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(47,153,76,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(47,153,76,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210],
    },
  ],
};

const optionsStatic = {
  title: {
    display: true,
    text: "Visit with & without Seasonal Impacts",
    fontSize: 20,
  },
  legend: {
    display: true,
    position: "bottom",
  },
  scales: {
    yAxes: [
      {
        ticks: {
          callback: function (value, index, values) {
            return value + "K";
          },
        },
      },
    ],
  },
};

function Dashboard() {
  const [chartType, setChartType] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [chartGenerated, setChartGenerated] = useState(false);
  const chartTypesOptions = ["line", "bar", "pie"];
  // Handle dropdown selections
  const handleChartTypeChangeChart = (e) => setChartType(e.target.value);
  const handleSheetNameChangeChart = (e) => setSheetName(e.target.value);

  // Check if both dropdowns are selected
  const isButtonEnabled = chartType && sheetName;
  const [noDataFound, setNoDataFound] = useState(false); // To track if no data is found

  // Function to generate the chart
  const handleGenerateChart = async () => {
    // Fetch saved row data from API to check for matching sheet data
    try {
      const response = await axios.get("http://localhost:3001/saverowsdata");

      if (response.data.success) {
        const savedData = response.data.savedData;

        // Find the matching data for the selected workbook and sheet
        const matchingData = savedData.find(
          (data) =>
            data.selectedWorkbookName === workbookNameUseDashboard &&
            data.selectedsheetName === sheetName // Match the selected sheet name
        );

        if (matchingData) {
          // Data found for the selected sheet, proceed to generate the chart
          console.log("Matching Data Found:", matchingData);

          const formattedData = matchingData.headers.map(
            (header, headerIndex) => {
              const pvValues = matchingData.rows.map((row) => row[headerIndex]);
              return {
                name: header, // Use the header as the chart label
                pv: pvValues[0], // Example: Use the first value in the pv array for the chart
              };
            }
          );

          setDataLineChart(formattedData); // Set the transformed data for the chart
          setChartGenerated(true); // Display the chart
          setNoDataFound(false); // Data found, so no need to show "No data found" message
        } else {
          // No data found for the selected sheet
          console.log("No data found for the selected sheet.");
          setChartGenerated(false); // Hide the chart
          setNoDataFound(true); // Show the "No data found" message
        }
      } else {
        console.error("Error fetching saverowsdata.");
      }
    } catch (error) {
      console.error("Error fetching saverowsdata:", error);
    }
  };

  const [dataLineChart, setDataLineChart] = useState([]); // Initialize the state for the chart data

  const [headersDefault, setDefaultHeaders] = useState([
    "Sr.",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
  ]);

  // Create a unique mapping of string values to their respective indices
  const uniqueStrings = [...new Set(dataLineChart.map((item) => item.pv))];
  const mappedData = dataLineChart.map((item) => ({
    name: item.name,
    pvIndex: uniqueStrings.indexOf(item.pv), // Get index for Y-axis
  }));

  const dataPieChart = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const [columnWidths, setColumnWidths] = useState(
    Array(headersDefault.length).fill(100)
  ); // Default width of 100px for each column
  const [rowsData, setRowsData] = useState(
    Array.from({ length: 8 }, () => Array(headersDefault.length - 1).fill(""))
  ); // Subtract 1 because "Sr no." isn't part of the editable row data

  const [activeDashboardTab, setactiveDashboardTab] = useState(null); // Active workbook
  const [fetchWorkbooks, setFetchWorkbooks] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const [activeSheet, setActiveSheet] = useState(null); // State to track the active sheet
  const [isHovered, setIsHovered] = useState(false);
  const [workbookNameUseDashboard, setWorkbookNameUseDashboard] = useState(""); // State to store workbook name
  const [sheetNamesUseDashboard, setSheetNamesUseDashboard] = useState([]); // State to store sheet names

  const [showCharts, setShowCharts] = useState(false); // State to control chart visibility

  const openDashboardPage = (workbook) => {
    setactiveDashboardTab(workbook);
    setWorkbookNameUseDashboard(workbook.workbookName); // Set the selected workbook name in state
    setSheetNamesUseDashboard(workbook.sheets); // Set the sheet names in state
    setShowCharts(true); // Show the message when clicked
  };

  const [showAddSheetModal, setShowAddSheetModal] = useState(false); // Modal visibility state
  const [sheetNumber, setSheetNumber] = useState(""); // Number input for sheets
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(null);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const [step, setStep] = useState(1);
  const [workbookName, setWorkbookName] = useState(""); // State to store workbook name
  const [sheetNames, setSheetNames] = useState([]); // State to manage sheet names

  const handleAddSingleRow = () => {
    setRowsData([...rowsData, Array(headersDefault.length - 1).fill("")]);
  };

  const handleAddMoreFiveRows = () => {
    const newRows = Array.from({ length: 5 }, () =>
      Array(headersDefault.length - 1).fill("")
    );
    setRowsData([...rowsData, ...newRows]);
  };

  const handleAddSingleColumn = () => {
    const lastHeader = headersDefault[headersDefault.length - 1];
    const nextHeader = getNextColumnLabel(lastHeader);
    setDefaultHeaders([...headersDefault, nextHeader]);
    setColumnWidths([...columnWidths, 100]); // Add default width for new column

    const updatedRows = rowsData.map((row) => [...row, ""]);
    setRowsData(updatedRows);
  };

  const handleAddMoreFiveColumns = () => {
    let newHeaders = [];
    let lastHeader = headersDefault[headersDefault.length - 1];

    for (let i = 0; i < 5; i++) {
      lastHeader = getNextColumnLabel(lastHeader);
      newHeaders.push(lastHeader);
    }

    setDefaultHeaders([...headersDefault, ...newHeaders]);
    setColumnWidths([...columnWidths, ...Array(5).fill(100)]); // Add default widths for new columns

    const updatedRows = rowsData.map((row) => [...row, ...Array(5).fill("")]);
    setRowsData(updatedRows);
  };
  // Open the modal to add sheets
  const addWorkbook = () => {
    setShowAddSheetModal(true); // Open modal
    setStep(1); // Reset to first step
    setWorkbookName(""); // Reset workbook name
    setSheetNumber(""); // Reset sheet number
    setSheetNames([]); // Reset sheet names
  };
  const handleWorkbookNameChange = (e) => {
    setWorkbookName(e.target.value); // Store workbook name
  };

  const handleSheetNumberChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value > 0) {
      setSheetNumber(value); // Store number of sheets if valid
    } else {
      setSheetNumber("");
    }
  };

  const handleSheetNameChange = (index, value) => {
    const updatedSheetNames = [...sheetNames];
    updatedSheetNames[index] = value; // Update sheet name at the given index
    setSheetNames(updatedSheetNames);
  };

  const handleNextStep = () => {
    if (step === 1 && workbookName) {
      setStep(2); // Move to step 2 when workbook name is filled
    } else if (step === 2 && sheetNumber) {
      setSheetNames(Array.from({ length: parseInt(sheetNumber) }, () => "")); // Prepare sheet names
      setStep(3); // Move to step 3
    }
  };
  // Handle modal sheet creation
  const handleCreateSheets = async () => {
    const newSheets = sheetNames.map(
      (name, index) => name || `Sheet ${index + 1}`
    );

    const workbookData = {
      workbookName,
      sheets: newSheets,
    };

    try {
      const response = await fetch("http://localhost:3001/workbooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workbookData),
      });

      if (response.ok) {
        setShowAlert(true);

        // Hide the alert after 3 seconds
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);

        // Fetch the updated list of workbooks after creating a new one
        await fetchWorkbooksSheets(); // Call the function here

        setShowAddSheetModal(false); // Close modal
        setWorkbookName(""); // Reset workbook name
        setSheetNames([]); // Reset sheet names
      } else {
        console.error("Failed to submit the workbook.");
      }
    } catch (error) {
      console.error("Error submitting workbook:", error);
    }
  };

  const handleSubmitSheetData = async () => {
    const customHeaders = rowsData[0].filter((header) => header.trim() !== ""); // Filter out empty headers

    const remainingRows = rowsData
      .slice(1)
      .map((row) => row.filter((cell) => cell.trim() !== "")) // Filter out empty cells in each row
      .filter((row) => row.length > 0); // Remove any empty rows

    const payload = {
      selectedWorkbookName: workbookName,
      selectedsheetName: activeSheet,
      headers: customHeaders,
      rows: remainingRows,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/saverowsdata",
        payload
      );
      if (response.status === 200) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving the data:", error);
    }
  };

  const fetchWorkbooksSheets = async () => {
    try {
      const response = await axios.get("http://localhost:3001/workbooks", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (response.data.success) {
        setFetchWorkbooks(response.data.workbooks); // Update state with fetched workbooks
      }
    } catch (error) {
      console.error("Error fetching workbooks:", error);
    }
  };

  // Fetch the workbooks on component mount
  useEffect(() => {
    fetchWorkbooksSheets(); // Call the function to fetch data when the component mounts
  }, []); // Empty array ensures this runs only once
  // Log the active workbook name and its sheet names
  useEffect(() => {
    if (workbookNameUseDashboard && sheetNamesUseDashboard.length > 0) {
      console.log("Workbook Name:", workbookNameUseDashboard);
      console.log("Sheet Names:", sheetNamesUseDashboard.join(", "));
    }
  }, [workbookNameUseDashboard, sheetNamesUseDashboard]);

  useEffect(() => {
    const fetchSaveRowsData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/saverowsdata");
        if (response.data.success) {
          const savedData = response.data.savedData[0]; // Assuming the data structure
          const headers = savedData.headers;
          const rows = savedData.rows;
          const selectedSheetName = savedData.selectedsheetName;
          const selectedWorkbookName = savedData.selectedWorkbookName;

          // Transform headers and corresponding row values into the desired format
          const formattedData = headers.map((header, headerIndex) => {
            const pvValues = rows.map((row) => row[headerIndex]); // Extract all values for the current header index
            return {
              name: header, // Current header as 'name'
              pv: pvValues[0], // For example, use the first value in the pv array
              selectedSheetName: selectedSheetName,
              selectedWorkbookName: selectedWorkbookName,
            };
          });

          setDataLineChart(formattedData); // Set the transformed data
        }
      } catch (error) {
        console.error("Error fetching saverowsdata:", error);
      }
    };

    fetchSaveRowsData();
  }, []);
  const handleSheetClick = async (sheet, workbook) => {
    setActiveSheet(sheet);
    setWorkbookName(workbook.workbookName);

    try {
      // Fetch saved row data from API
      const response = await axios.get("http://localhost:3001/saverowsdata");

      if (response.data.success) {
        const savedData = response.data.savedData;

        // Find the matching data for the selected workbook and sheet
        const matchingData = savedData.find(
          (data) =>
            data.selectedWorkbookName === workbook.workbookName &&
            data.selectedsheetName === sheet
        );

        if (matchingData) {
          // Log matching data if found
          console.log("Matching Data Found:", matchingData);
          console.log("Rows Data:", matchingData.rows);
        } else {
          // Log a message if no matching data is found
          console.log("Data not found for selected workbook and sheet.");
        }
      } else {
        console.error("Error: Failed to fetch saverowsdata.");
      }
    } catch (error) {
      console.error("Error fetching saverowsdata:", error);
    }
  };

  const handleRowChangeData = (rowIndex, cellIndex, value) => {
    const updatedRows = [...rowsData];
    updatedRows[rowIndex][cellIndex] = value;
    setRowsData(updatedRows);
  };

  return (
    <div className="d-flex" id="wrapper">
      {" "}
      {/* Sidebar */}{" "}
      <div
        className="bg-dark text-white"
        id="sidebar-wrapper"
        style={{ minHeight: "100vh", width: "250px" }}
      >
        <div className="sidebar-heading text-center py-4 primary-text fs-4 fw-bold">
          My Dashboard{" "}
        </div>{" "}
        <div
          className="list-group list-group-flush my-3 "
          style={{ cursor: "pointer" }}
        >
          {" "}
          {/* Add Workbook link */}{" "}
          <a
            onClick={addWorkbook} // Call addWorkbook on click
            className="list-group-item list-group-item-action bg-transparent text-white d-flex justify-content-between align-items-center custom-hover-effect-workbook"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
              transition: "color 0.3s ease",
            }}
          >
            <span> Add Workbook </span>{" "}
          </a>{" "}
          {/* Dropdown Submenu */}{" "}
          {fetchWorkbooks.length > 0 && (
            <div className="list-group">
              {" "}
              {fetchWorkbooks.map((workbook, index) => (
                <div key={index} className="border p-3 mb-2">
                  {" "}
                  {/* Workbook name inside the same border */}{" "}
                  <div className="list-group-item bg-transparent text-white d-flex align-items-center justify-content-between">
                    <FaFileAlt className="me-2" /> {workbook.workbookName}{" "}
                  </div>{" "}
                  <div
                    className="list-group-item bg-transparent text-white d-flex align-items-center justify-content-between custom-hover-effect-dashboard"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      cursor: "pointer",
                      transition: "color 0.3s ease",
                    }}
                    key={workbook._id}
                    onClick={() => openDashboardPage(workbook)}
                  >
                    Dashboard Page{" "}
                  </div>{" "}
                  {/* Sheet names also inside the same border */}{" "}
                  <div className="sheet-container mt-2">
                    {" "}
                    {workbook.sheets.map((sheet, sheetIndex) => (
                      <a
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          position: "relative",
                          display: "inline-block",
                          cursor: "pointer",
                          transition: "color 0.3s ease",
                        }}
                        key={sheetIndex}
                        onClick={() => handleSheetClick(sheet, workbook)}
                        className="list-group-item list-group-item-action bg-transparent text-white custom-hover-effect-sheets"
                      >
                        {sheet}{" "}
                      </a>
                    ))}{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>
          )}{" "}
          {/* Logout Link */}{" "}
        </div>{" "}
      </div>{" "}
      {/* Page Content */}{" "}
      <div
        id="page-content-wrapper"
        className="w-100 p-4"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
          <div className="container-fluid">
            <input
              type="text"
              className="form-control"
              id="search-bar"
              placeholder="Search..."
              style={{ width: "300px", height: "50px" }}
            />{" "}
            <button className="navbar-toggler" type="button">
              <span className="navbar-toggler-icon"> </span>{" "}
            </button>{" "}
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                <li className="nav-item">
                  <a className="nav-link text-dark" href="#">
                    Dashboard{" "}
                  </a>{" "}
                </li>{" "}
                <li className="nav-item">
                  <a className="nav-link text-dark" href="#">
                    Profile{" "}
                  </a>{" "}
                </li>{" "}
                <li className="nav-item">
                  <a className="nav-link text-dark" href="#">
                    Settings{" "}
                  </a>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
          </div>{" "}
        </nav>{" "}
        <Modal
          show={showAddSheetModal}
          onHide={() => setShowAddSheetModal(false)}
          dialogClassName="modal-dialog-scrollable"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-center w-100">
              {" "}
              {step === 1
                ? "Workbook Name"
                : step === 2
                ? "Number of Sheets"
                : "Sheet Names"}{" "}
            </Modal.Title>{" "}
          </Modal.Header>{" "}
          <Modal.Body>
            {" "}
            {step === 1 && (
              <input
                type="text"
                value={workbookName}
                onChange={handleWorkbookNameChange}
                placeholder="Enter Workbook Name"
                className="form-control mb-3 p-3 border-primary shadow-sm rounded"
              />
            )}{" "}
            {step === 2 && (
              <input
                type="number"
                value={sheetNumber}
                onChange={handleSheetNumberChange}
                placeholder="Enter Number of Sheets"
                className="form-control mb-3 p-3 border-primary shadow-sm rounded"
              />
            )}{" "}
            {step === 3 && (
              <div>
                {" "}
                {sheetNames.map((sheet, index) => (
                  <input
                    key={index}
                    type="text"
                    value={sheet}
                    onChange={(e) =>
                      handleSheetNameChange(index, e.target.value)
                    }
                    placeholder={`Sheet ${index + 1} Name`}
                    className="form-control mb-3 p-3 border-primary shadow-sm rounded"
                  />
                ))}{" "}
              </div>
            )}{" "}
          </Modal.Body>{" "}
          <Modal.Footer className="justify-content-center">
            {" "}
            {step < 3 ? (
              <Button
                variant="primary"
                onClick={handleNextStep}
                disabled={step === 1 ? !workbookName : !sheetNumber}
              >
                Next{" "}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleCreateSheets} // Call the function to save workbook and sheets
                disabled={sheetNames.some((name) => !name)}
              >
                Save Sheets{" "}
              </Button>
            )}{" "}
            <Button
              variant="secondary"
              onClick={() => setShowAddSheetModal(false)}
            >
              Close{" "}
            </Button>{" "}
          </Modal.Footer>{" "}
        </Modal>{" "}
        <div className="container-fluid main-container">
          {" "}
          {showCharts ? (
            <>
              <div className="container mt-5">
                {" "}
                <div className="col-lg-12 col-md-10">
                  {" "}
                  <h1 className="text-center mb-4">
                    Custom Multi - Chart Generator with Multiple Data Sets of{" "}
                    {workbookNameUseDashboard}{" "}
                  </h1>{" "}
                  <div className="card p-4 shadow-sm">
                    <div className="d-flex align-items-center justify-content-between">
                      {" "}
                      <div className="form-group mb-0 me-3 flex-fill">
                        <label htmlFor="chartType" className="form-label">
                          Select Chart Type:
                        </label>{" "}
                        <select
                          id="chartType"
                          className="form-select"
                          value={chartType}
                          onChange={handleChartTypeChangeChart}
                        >
                          <option value="" disabled>
                            Select Chart Type{" "}
                          </option>{" "}
                          {chartTypesOptions.map((type) => (
                            <option key={type} value={type}>
                              {" "}
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                              Chart{" "}
                            </option>
                          ))}{" "}
                        </select>{" "}
                      </div>{" "}
                      {/* Dropdown for selecting sheet name */}{" "}
                      <div className="form-group mb-0 me-3 flex-fill">
                        <label htmlFor="sheetName" className="form-label">
                          Select Sheet Name:
                        </label>{" "}
                        <select
                          id="sheetName"
                          className="form-select"
                          value={sheetName}
                          onChange={handleSheetNameChangeChart}
                        >
                          <option value="" disabled>
                            Select Sheet Name{" "}
                          </option>{" "}
                          {sheetNamesUseDashboard.map((sheet) => (
                            <option key={sheet} value={sheet}>
                              {" "}
                              {sheet}{" "}
                            </option>
                          ))}{" "}
                        </select>{" "}
                      </div>{" "}
                      <div className="d-grid gap-2">
                        <button
                          className={`btn btn-primary ${
                            isButtonEnabled ? "" : "disabled"
                          }`}
                          onClick={handleGenerateChart}
                          disabled={!isButtonEnabled}
                        >
                          Generate Chart{" "}
                        </button>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  {chartGenerated ? (
                    <div className="mt-4">
                      <h3 className="text-center">
                        {" "}
                        {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                        Chart for {sheetName}{" "}
                      </h3>{" "}
                      <div className="chart-container p-3 mt-3 border">
                        {" "}
                        {chartType === "line" && (
                          // <LineChart
                          //   width={1200}
                          //   height={600}
                          //   margin={{
                          //     top: 70,
                          //     right: 70,
                          //     left: 70,
                          //     bottom: 70,
                          //   }}
                          //   data={mappedData}
                          // >
                          //   <YAxis
                          //     domain={[-1, uniqueStrings.length]} // Ensure the full range is covered
                          //     tickFormatter={(value) =>
                          //       uniqueStrings[value] || ""
                          //     } // Map index to string value
                          //     ticks={uniqueStrings.map((_, index) => index)} // Ensure all indices are shown
                          //   />{" "}
                          //   <CartesianGrid strokeDasharray="3 3" />
                          //   <XAxis dataKey="name" />
                          //   <YAxis />
                          //   <Tooltip />
                          //   <Legend />
                          //   <Line
                          //     type="monotone"
                          //     dataKey="pvIndex" // Use the index for Y-axis
                          //     stroke="#8884d8"
                          //     activeDot={{ r: 8 }}
                          //   />{" "}
                          //   <Line
                          //     type="monotone"
                          //     dataKey="uv"
                          //     stroke="#82ca9d"
                          //   />
                          // </LineChart>
                          <Line data={dataStatic} options={optionsStatic} />
                        )}{" "}
                        {chartType === "bar" && (
                          // <BarChart
                          //   width={1200}
                          //   height={600}
                          //   margin={{
                          //     top: 70,
                          //     right: 70,
                          //     left: 70,
                          //     bottom: 70,
                          //   }}
                          //   data={mappedData}
                          // >
                          //   <XAxis dataKey="name" />
                          //   <YAxis
                          //     domain={[-1, uniqueStrings.length]} // Ensure the full range is covered
                          //     tickFormatter={(value) =>
                          //       uniqueStrings[value] || ""
                          //     } // Map index to string value
                          //     ticks={uniqueStrings.map((_, index) => index)} // Ensure all indices are shown
                          //   />{" "}
                          //   <RechartsTooltip />
                          //   <RechartsLegend />
                          //   <Bar dataKey="pvIndex" fill="#82ca9d" />{" "}
                          //   {/* Change to pvIndex or uv if applicable */}{" "}
                          // </BarChart>
                          <span> Bar Chart </span>
                        )}{" "}
                        {chartType === "pie" && (
                          // <PieChart
                          //   width={1200}
                          //   height={600}
                          //   margin={{
                          //     top: 70,
                          //     right: 70,
                          //     left: 70,
                          //     bottom: 70,
                          //   }}
                          // >
                          //   <Pie
                          //     data={dataPieChart} // Ensure data structure matches this
                          //     width={1200}
                          //     height={600}
                          //     labelLine={false}
                          //     outerRadius={200}
                          //     fill="#8884d8"
                          //     dataKey="value" // Ensure this matches a valid key in dataPieChart
                          //   >
                          //     {dataPieChart.map((entry, index) => (
                          //       <Cell
                          //         key={`cell-${index}`}
                          //         fill={COLORS[index % COLORS.length]} // Set color based on index
                          //       />
                          //     ))}{" "}
                          //   </Pie>{" "}
                          //   <RechartsTooltip />
                          // </PieChart>
                          <span> Pie Chart </span>
                        )}{" "}
                      </div>{" "}
                    </div>
                  ) : noDataFound ? (
                    <p> No data found for the selected sheet. </p>
                  ) : null}{" "}
                </div>{" "}
                {/* </div>{" "} */}{" "}
              </div>{" "}
            </>
          ) : activeSheet ? (
            <>
              {" "}
              <h3 className="text-center">
                {" "}
                WorkbookName: {workbookName} <br />
                SheetName: {activeSheet}{" "}
              </h3>{" "}
              {showAlert && (
                <div className="alert alert-success">
                  Data will submit successfully{" "}
                </div>
              )}{" "}
              <Container className="text-center">
                <Row className="justify-content-center my-4">
                  <Col>
                    <Button variant="primary" onClick={handleAddSingleRow}>
                      Add Single Row{" "}
                    </Button>{" "}
                    <Button variant="primary" onClick={handleAddMoreFiveRows}>
                      Add More Five Rows{" "}
                    </Button>{" "}
                    <Button variant="primary" onClick={handleAddSingleColumn}>
                      Add Single Column{" "}
                    </Button>{" "}
                    <Button
                      variant="primary"
                      onClick={handleAddMoreFiveColumns}
                    >
                      Add More Five Columns{" "}
                    </Button>{" "}
                    <Button variant="success" onClick={handleSubmitSheetData}>
                      Submit Sheet Data{" "}
                    </Button>{" "}
                  </Col>{" "}
                </Row>{" "}
                <div style={{ padding: "16px", borderRadius: "8px" }}>
                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      overflowX: headersDefault.length > 8 ? "auto" : "hidden", // Horizontal scroll if more than 8 columns
                    }}
                  >
                    <Table
                      bordered
                      hover
                      className="mx-auto text-center"
                      style={{
                        minWidth: `${headersDefault.length * 100}px`, // Ensures that column width adjusts dynamically
                        tableLayout: "auto", // Adjust the column size automatically
                      }}
                    >
                      <thead>
                        <tr>
                          {" "}
                          {headersDefault.map((col, index) => (
                            <th
                              key={index}
                              className="table-header"
                              style={{
                                width: columnWidths[index],
                                backgroundColor:
                                  col === selectedColumnIndex
                                    ? "rgb(25, 135, 84)"
                                    : "",
                              }}
                              onClick={() => setSelectedColumnIndex(index - 1)} // Set selected column index on click
                            >
                              {String(col)}{" "}
                            </th>
                          ))}{" "}
                        </tr>{" "}
                      </thead>{" "}
                      <tbody>
                        {" "}
                        {rowsData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            <td> {rowIndex + 1} </td>{" "}
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                style={{
                                  backgroundColor:
                                    cellIndex === selectedColumnIndex
                                      ? "rgb(25, 135, 84)"
                                      : "", // Highlight color
                                }}
                              >
                                <input
                                  type="text"
                                  value={cell}
                                  onChange={(e) =>
                                    handleRowChangeData(
                                      rowIndex,
                                      cellIndex,
                                      e.target.value
                                    )
                                  }
                                  className="form-control no-border-input"
                                  style={{ width: "100%", minWidth: "100px" }} // Ensures minimum width for each input
                                />{" "}
                              </td>
                            ))}{" "}
                          </tr>
                        ))}{" "}
                      </tbody>{" "}
                    </Table>{" "}
                  </div>{" "}
                </div>{" "}
              </Container>{" "}
            </>
          ) : (
            <>
              {" "}
              <h1 className="mt-4"> Welcome to Your Dashboard </h1>{" "}
            </>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default Dashboard;
