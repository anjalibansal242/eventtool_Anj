import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SummaryComponent.css";
import { updateAttendeeConsumptions } from "./apiService";
import { useEvent } from "./EventDetailsContext";
import { getTravelModes } from "./apiService";
import CustomAlert from "./CustomAlert"; // Import CustomAlert component
import { GetExtrapolateSummary, useApi } from "./apiService";
import { QRCodeCanvas } from "qrcode.react";
import logoSrc from "./assets/ecologo.png";

const accommodationTypes = {
  1: "3-star",
  2: "4-star",
  3: "5-star",
};

const mealTypes = {
  6: "Veg",
  7: "Non Veg",
  8: "Vegan",
};

const SummaryComponent = ({ summaryData }) => {
  const navigate = useNavigate();
  const { eventDetails } = useEvent();
  const api = useApi();
  const canvasRef = useRef(null);
  const [showToast, setShowToast] = useState(false);

  const [attendeeData, setAttendeeData] = useState({
    attendeePercentage: "0%",
    attendeeTravelConsumptions: [],
    attendeeAccommodationConsumptions: [],
    attendeeMealConsumptions: [],
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [travelModes, setTravelModes] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isExcelUploadButtonDisabled, setExcelUploadIsButtonDisabled] =
    useState(false);

  useEffect(() => {
    const fetchTravelModes = async () => {
      try {
        const response = await getTravelModes("Individual");
        console.log("Travel Mode", response);
        setTravelModes(response);
      } catch (error) {
        console.error("Error fetching travel modes:", error);
      }
    };

    fetchTravelModes();
  }, []);
  useEffect(() => {
    console.log("ss", summaryData);
    if (summaryData.attendee.eventLock) {
      setIsButtonDisabled(true);
      setExcelUploadIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
      setExcelUploadIsButtonDisabled(false);
    }
  }, [summaryData.eventLock]);

  useEffect(() => {
    const fetchData = async () => {
      if (eventDetails?.eventId) {
        try {
          const response = summaryData;
          console.log("Summary Component:", response);
          setAttendeeData({
            attendeePercentage:
              response.attendee.attendeePercentage + "%" || "0%",
            attendeeTravelConsumptions:
              response.attendee.attendeeTravelConsumptions || [],
            attendeeAccommodationConsumptions:
              response.attendee.attendeeAccommodationConsumptions || [],
            attendeeMealConsumptions:
              response.attendee.attendeeMealConsumptions || [],
          });
        } catch (error) {
          console.error("Error fetching attendee data:", error);
        }
      }
    };

    fetchData();
  }, [eventDetails, summaryData]);

  const linkto = `https://ecoindex.ai/add-information?id=${eventDetails.eventId}&eventName=${eventDetails.eventName}`;

  const generateImage = () => {
    const qrCanvas = canvasRef.current.querySelector("canvas");

    const qrDataUrl = qrCanvas.toDataURL("image/png", 1.0);

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = 850 * 2;
    finalCanvas.height = 1200 * 2;
    const ctx = finalCanvas.getContext("2d");

    ctx.scale(2, 2);

    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, finalCanvas.width / 2, finalCanvas.height / 2);

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#007272";
    ctx.strokeRect(
      20,
      20,
      finalCanvas.width / 2 - 40,
      finalCanvas.height / 2 - 40
    );

    ctx.font = '32px "Montserrat", sans-serif';
    ctx.fillStyle = "#007272";
    ctx.textAlign = "center";
    ctx.fillText("Please scan and share", finalCanvas.width / 4, 125);

    ctx.fillText("your details to make", finalCanvas.width / 4, 175);

    const ToFitText = (
      context,
      text,
      x,
      y,
      maxWidth,
      initialFontSize,
      minFontSize,
      lineHeight
    ) => {
      let fontSize = initialFontSize;
      context.font = `bold ${fontSize}px "Lora", serif`;
      let textWidth = context.measureText(text).width;

      while (textWidth > maxWidth && fontSize > minFontSize) {
        fontSize -= 2;
        context.font = `bold ${fontSize}px "Lora", serif`;
        textWidth = context.measureText(text).width;
      }

      if (textWidth > maxWidth) {
        const words = text.split(" ");
        let line = "";
        let newY = y;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          const testWidth = context.measureText(testLine).width;
          if (testWidth > maxWidth && i > 0) {
            context.fillText(line, x, newY);
            line = words[i] + " ";
            newY += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, newY);
      } else {
        context.fillText(text, x, y);
      }
    };

    ToFitText(
      ctx,
      eventDetails.eventName,
      finalCanvas.width / 4,
      260,
      finalCanvas.width / 2 - 40,
      80,
      40,
      30
    );

    ctx.font = '40px "Montserrat", sans-serif';
    ctx.fillStyle = "#007272";
    ctx.fillText("A", finalCanvas.width / 4, 350);
    ctx.fillText("Carbon", finalCanvas.width / 4, 390);
    ctx.fillText("Neutral Event", finalCanvas.width / 4, 430);

    const qrSize = 500;
    const qrX = (finalCanvas.width / 2 - qrSize) / 2;
    const qrY = 470;
    const qrImage = new Image();
    qrImage.src = qrDataUrl;
    qrImage.onload = () => {
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
      const logoImage = new Image();
      logoImage.src = logoSrc;
      logoImage.onload = () => {
        const logoWidth = 140;
        const logoHeight = 40;
        const logoX = 40;
        const logoY = 40;
        ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

        ctx.font = '28px "Montserrat", sans-serif';
        ctx.fillStyle = "#007272";
        ctx.fillText(
          "Thank you for your contribution!",
          finalCanvas.width / 4,
          qrY + qrSize + 100
        );

        const finalDataUrl = finalCanvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = finalDataUrl;
        downloadLink.download = `Add Information: ${eventDetails.eventName}.png`;
        downloadLink.click();
      };
    };
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(linkto).then(() => {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    });
  };
  const handleInputChange = (event, index, type) => {
    const value = event.target.value;
    setAttendeeData((prevData) => {
      const updatedData = { ...prevData };
      if (type === "travel") {
        updatedData.attendeeTravelConsumptions[index][event.target.name] =
          value;
      } else if (type === "accommodation") {
        updatedData.attendeeAccommodationConsumptions[index][
          event.target.name
        ] = value;
      } else if (type === "meal") {
        updatedData.attendeeMealConsumptions[index][event.target.name] = value;
      }
      return updatedData;
    });
  };

  const handleFormSubmit = async () => {
    if (isEditable) {
      const data = {
        attendeePercentage: parseInt(attendeeData.attendeePercentage),
        attendeeTravelConsumptions: attendeeData.attendeeTravelConsumptions,
        attendeeAccommodationConsumptions:
          attendeeData.attendeeAccommodationConsumptions,
        attendeeMealConsumptions: attendeeData.attendeeMealConsumptions,
      };

      console.log("Data to be updated:", data);

      try {
        const response = await updateAttendeeConsumptions(data);
        console.log("API Response:", response);
        console.log("Updated Attendee Data:", data);
        setAlertMessage("Data saved successfully");
        setAlertType("success");
        setShowAlert(true);
      } catch (error) {
        console.error("Error updating attendee data:", error);
        setAlertMessage(
          "Error saving data. Please check your inputs and try again."
        );
        setAlertType("error");
        setShowAlert(true);
      }
    }
    setIsEditable(!isEditable);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === "success") {
      navigate("/events/during-event-planning/energy-consumption");
    }
  };

  const handleExtrapolateSummary = async () => {
    if (isEditable) {
      const data = {
        attendeePercentage: parseInt(attendeeData.attendeePercentage),
        attendeeTravelConsumptions: attendeeData.attendeeTravelConsumptions,
        attendeeAccommodationConsumptions:
          attendeeData.attendeeAccommodationConsumptions,
        attendeeMealConsumptions: attendeeData.attendeeMealConsumptions,
      };

      console.log("Data to be updated:", JSON.stringify(data));

      try {
        const response = await updateAttendeeConsumptions(data);
        console.log("API Response:", response);
        console.log("Updated Attendee Data:", data);
        setAlertMessage("Data saved successfully");
        setAlertType("success");
        setShowAlert(true);
        setIsButtonDisabled(true);
      } catch (error) {
        console.error("Error updating attendee data:", error);
        setAlertMessage(
          "Error saving data. Please check your inputs and try again."
        );
        setAlertType("error");
        setShowAlert(true);
      }
    } else {
      const response = await GetExtrapolateSummary(eventDetails.eventId);
      console.log("Extrapolate data:", response);
      setAttendeeData({
        attendeePercentage: response.attendee.attendeePercentage + "%" || "0%",
        attendeeTravelConsumptions:
          response.attendee.attendeeTravelConsumptions || [],
        attendeeAccommodationConsumptions:
          response.attendee.attendeeAccommodationConsumptions || [],
        attendeeMealConsumptions:
          response.attendee.attendeeMealConsumptions || [],
      });
    }
    setIsEditable(!isEditable);
  };

  const handleUploadExcel = () => {
    navigate("/events/during-event-planning/attendee-details/uploadsummary", {
      state: { type: "Summary" },
    });
  };

  return (
    <div className="row">
      <div className="col-md-7">
        <div className="qr-code-section">
          <div ref={canvasRef}>
            <QRCodeCanvas
              value={linkto}
              size={256}
              style={{ display: "none" }}
              level="M"
              marginSize={2}
              title={eventDetails.eventName}
            />{" "}
            <button className="btn GreenBtn" onClick={generateImage}>
              Download QR Code
            </button>
            <button className="btn GreenBtn" onClick={copyLinkToClipboard}>
              Copy Link
            </button>
            {showToast && (
              <div className="toast-notification">
                Link copied to clipboard!
              </div>
            )}
          </div>
        </div>

        <h4>Attendee Details</h4>

        <div className="input-group">
          <span className="input-group-text">
            Percentage of Attendee Data Filled:
          </span>
          <span>
            <input
              type="text"
              value={attendeeData.attendeePercentage}
              className="form-control"
              onChange={(e) =>
                setAttendeeData({
                  ...attendeeData,
                  attendeePercentage: e.target.value,
                })
              }
              disabled={!isEditable}
            />
          </span>
        </div>

        <section className="summary-section">
          <h4>Travel</h4>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Mode</th>
                <th>Type</th>
                <th>Number of people</th>
                <th>Distance travelled</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {attendeeData.attendeeTravelConsumptions.map((travel, index) => (
                <tr key={index}>
                  <td>
                    {travelModes.find(
                      (mode) => mode.travelModeId === travel.travelModeId
                    )
                      ? travelModes.find(
                          (mode) => mode.travelModeId === travel.travelModeId
                        ).mode
                      : ""}
                  </td>
                  <td>
                    {travelModes.find(
                      (mode) => mode.travelModeId === travel.travelModeId
                    )
                      ? travelModes.find(
                          (mode) => mode.travelModeId === travel.travelModeId
                        ).type
                      : ""}
                  </td>
                  <td>
                    <input
                      type="text"
                      name="attendeeCount"
                      className="form-control"
                      value={travel.attendeeCount}
                      onChange={(e) => handleInputChange(e, index, "travel")}
                      disabled={!isEditable}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="avgDistance"
                      className="form-control"
                      value={travel.avgDistance}
                      onChange={(e) => handleInputChange(e, index, "travel")}
                      disabled={!isEditable}
                    />
                  </td>
                  <td>Km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="accommodation-details">
          <h4>Accommodation</h4>

          {attendeeData.attendeeAccommodationConsumptions.map(
            (accommodation, index) => (
              <div className="input-group" key={index}>
                <span className="input-group-text">
                  {accommodationTypes[accommodation.accommodationId] ? (
                    <span className="input-group-text">
                      Number of people staying in{" "}
                      {accommodationTypes[accommodation.accommodationId]}
                    </span>
                  ) : (
                    <span className="input-group-text">
                      Number of people chosen NA
                    </span>
                  )}
                  {/* Number of people staying in{" "}
                  {accommodationTypes[accommodation.accommodationId] || "Number of people chosen NA"} */}
                </span>
                <span>
                  <input
                    type="text"
                    className="form-control"
                    name="attendeeCount"
                    value={accommodation.attendeeCount}
                    onChange={(e) =>
                      handleInputChange(e, index, "accommodation")
                    }
                    disabled={!isEditable}
                  />
                </span>
              </div>
            )
          )}
        </section>

        <section className="meal-details">
          <h4>Meals</h4>

          {attendeeData.attendeeMealConsumptions.map((meal, index) => (
            <div className="input-group" key={index}>
              <span className="input-group-text">
                Number of people having {mealTypes[meal.mealId]}
              </span>
              <span>
                {" "}
                <input
                  type="text"
                  className="form-control"
                  name="attendeeCount"
                  value={meal.attendeeCount}
                  onChange={(e) => handleInputChange(e, index, "meal")}
                  disabled={!isEditable}
                />
              </span>
            </div>
          ))}
        </section>

        {/* Commented Save Button */}
        {/* <button className="summary-button" onClick={handleFormSubmit}>
        {isEditable ? "Save" : "Edit and Update the Summary"}
      </button> */}

        {summaryData.attendee.attendeePercentage !== 100 && (
          <div className="btngroup">
            <button
              className="summary-button"
              onClick={handleExtrapolateSummary}
              disabled={isButtonDisabled}
            >
              {isEditable ? "Save" : "Extrapolate the Summary"}
            </button>
            <button
              className="summary-button"
              onClick={handleUploadExcel}
              disabled={isExcelUploadButtonDisabled}
            >
              Update Attendee Summary Information
            </button>
          </div>
        )}

        {showAlert && (
          <CustomAlert
            message={alertMessage}
            type={alertType}
            onClose={handleCloseAlert}
          />
        )}
      </div>
    </div>
  );
};

export default SummaryComponent;
