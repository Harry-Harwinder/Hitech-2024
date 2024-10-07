import React, { useState } from "react";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

// Function to get the next column label based on the current header
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

function ExcelTable() {
  const [headersDefault, setDefaultHeaders] = useState([
    "Sr No.",
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

  const [columnWidths, setColumnWidths] = useState(
    Array(headersDefault.length).fill(100)
  ); // Default width of 100px for each column

  const [rowsData, setRowsData] = useState(
    Array.from({ length: 6 }, () => Array(headersDefault.length - 1).fill(""))
  ); // Subtract 1 because "Sr no." isn't part of the editable row data

  const [showAlert, setShowAlert] = useState(false);
  const [activeSheet, setActiveSheet] = useState("Sheet1");
  const [workbookName, setWorkbookName] = useState("Workbook1");

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

  const handleRowChangeData = (rowIndex, cellIndex, value) => {
    const updatedRows = [...rowsData];
    updatedRows[rowIndex][cellIndex] = value;
    setRowsData(updatedRows);
  };

  // Function to handle submission and save data
  const handleSubmitSheetData = async () => {
    if (validateAllFieldsFilledData()) {
      const customHeaders = rowsData[0];
      const remainingRows = rowsData.slice(1);

      const payload = {
        sheetName: activeSheet,
        workbookName: workbookName,
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
    }
  };

  // Function to validate all fields are filled before submission
  const validateAllFieldsFilledData = () => {
    return rowsData.every((row) => row.every((cell) => cell !== ""));
  };

  return (
    <>
      <h3 className="text-center">
        {" "}
        {activeSheet} {workbookName}{" "}
      </h3>{" "}
      {showAlert && (
        <div className="alert alert-success">
          {" "}
          Data submitted successfully!{" "}
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
            <Button variant="primary" onClick={handleAddMoreFiveColumns}>
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
              overflowX: "auto", // Allow horizontal scrolling
            }}
          >
            <Table
              bordered
              hover
              className="mx-auto text-center"
              style={{
                minWidth: `${headersDefault.length * 100}px`, // Dynamic width based on number of columns
              }}
            >
              <thead>
                <tr>
                  {" "}
                  {headersDefault.map((col, index) => (
                    <th key={index} style={{ width: columnWidths[index] }}>
                      {" "}
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
                      <td key={cellIndex}>
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
                        />
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
  );
}

export default ExcelTable;
