import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EventName from "./EventName";
import SummaryComponent from "./SummaryComponent";
import ImageComponent from "./ImageComponent";
import DownloadTemplateButton from "./DownloadTemplateButton";
import UploadSpreadsheetButton from "./UploadSpreadsheetButton";
import "./attendeeDetails.css";
import { isAttendeeDetailsInitiated } from "./apiService";
import { useEvent } from "./EventDetailsContext";

const AttendeeDetails = () => {
  const location = useLocation();
  const { type } = location.state || {};
  const { eventDetails } = useEvent();
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [summaryData, setsummaryData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!eventDetails) {
          throw new Error("Event details not available");
        }

        const eventId = eventDetails.eventId;

        const data = await isAttendeeDetailsInitiated(eventId);
        setsummaryData(data);
        console.log("API response:", data);

        if (data.message === "") {
          console.log("No message, showing summary component.");
          setShowSummary(true);
        } else {
          console.log("Message is present, showing upload section.");
          setShowSummary(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Error fetching data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [eventDetails]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }
  const isAttendee = eventDetails?.myRole === "Attendee";
  if (isAttendee) {
    return (
      <div className="access-restricted">
        <p style={{ fontSize: "25px", color: "#007272" }}>
          Access Restricted to Event Managers Only
        </p>
        <p style={{ fontSize: "30px", color: "#007272" }}>
          Please fill your details in the{" "}
          <strong>
            <span style={{ color: "#000000" }}>"INDIVIDUAL"</span>
          </strong>{" "}
          Tab
        </p>
      </div>
    );
  } else {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="White_Box">
              <div className="row">
                <div className="col-md-12">
                  <div className="attendee-details">
                    <EventName />
                    {showSummary ? (
                      <SummaryComponent summaryData={summaryData} />
                    ) : (
                      <>
                        <p>
                          Upload the list of organizers using the{" "}
                          <a href="https://api.ecoindex.ai/download/Invite/invite.xlsx">
                            file format
                          </a>{" "}
                        </p>
                        <div className="buttons mt-5">
                          <UploadSpreadsheetButton uploadtype={type} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AttendeeDetails;
