import React, { useState, useRef } from "react";
import { useApi } from "./apiService";
import { useEvent } from "./EventDetailsContext";
import { useNavigate } from "react-router-dom";
import CustomAlert from "./CustomAlert";

const UploadSpreadsheetButton = ({ uploadtype, onUploadSuccess, fileName }) => {
  const api = useApi();
  const { eventDetails } = useEvent();
  const [selectedFile, setSelectedFile] = useState(null);
  const [type, setType] = useState(uploadtype);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const allowedFileTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      setAlertMessage("Please upload a valid Excel file");
      setAlertType("error");
      setShowAlert(true);
      fileInputRef.current.value = null;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !eventDetails || !eventDetails.eventId) {
      setAlertMessage("Please upload the spreadsheet first!");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append("FileData", selectedFile);
    formData.append("EventId", eventDetails.eventId);
    formData.append("Type", type);

    try {
      const response = await api.post("/api/Upload/UploadTemplate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          EventId: eventDetails.eventId,
          Type: type,
        },
      });
      console.log("File uploaded successfully:", response.data);
      if (type === "meetinginvite" && onUploadSuccess) {
        onUploadSuccess(response.data);
      }
      setSelectedFile(null);
      uploadtype === "Invite"
        ? setAlertMessage("Invitations Sent!")
        : setAlertMessage(
            "File uploaded successfully and emails will be sent soon!"
          );
      setAlertType("success");
      setShowAlert(true);
      fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error uploading file:", error);
      setAlertMessage(
        "Error uploading file. Please check your authentication and API endpoint."
      );
      setAlertType("error");
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === "success" && type === "meetingsummary") {
      navigate("/events/pre-event-planning/meeting-list");
    }
    if (alertType === "success" && type === "energy-consumption") {
      navigate("/events/during-event-planning/energy-consumption");
    }
    if (alertType === "success" && type === "meetinginvite") {
      navigate("/events/pre-event-planning/meeting-list");
    }
  };

  return (
    <div className="upload-spreadsheet-button">
      <span>
        <button className="btn GreenBtn ML10px" onClick={handleButtonClick}>
          {" "}
          Upload Spreadsheet
        </button>
      </span>
      <span>
        <input
          type="file"
          className="form-control"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".xlsx, .xls"
        />
      </span>
      <span>
        <input
          type="text"
          className="form-control"
          value={fileName ? fileName : selectedFile ? selectedFile.name : ""}
          readOnly
          placeholder="No file selected"
        />
      </span>
      <span>
        <button
          className="btn GreenBtn"
          onClick={handleUpload}
          disabled={fileName || !selectedFile} // Disable if fileName is present or no file is selected
        >
          {type === "Summary"
            ? "Save"
            : type === "meetinginvite"
            ? "Upload"
            : "Send"}
        </button>
      </span>

      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={handleCloseAlert}
          onOk={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default UploadSpreadsheetButton;
