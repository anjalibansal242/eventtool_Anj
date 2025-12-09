import React, { useState, useEffect } from "react";
import EventName from "./EventName";
import "./attendeeDetails.css";
import { useNavigate } from "react-router-dom";
import SummaryComponent from "./SummaryComponent";
import { useEvent } from "./EventDetailsContext";
import "../src/assets/styles/bootstrap-4.4.1.css";
import { isAttendeeDetailsInitiated } from "./apiService";
import "../src/assets/styles/style.css";

const AttendeeConfirmation = () => {
  const { eventDetails } = useEvent();
  const navigate = useNavigate();
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

  const handleEmailResponse = (response) => {
    if (response === "yes") {
      navigate("summary", {
        state: { type: "Invite" },
      });
    } else {
      navigate("uploadsummary");
    }
  };

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
                          Send email to Attendees for uploading their travel,
                          stay, and meals.
                        </p>
                        <button
                          className="btn GreenBtn"
                          onClick={() => handleEmailResponse("yes")}
                        >
                          Yes
                        </button>
                        <button
                          className="btn GreenLineBtn"
                          onClick={() => handleEmailResponse("no")}
                        >
                          No
                        </button>
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

export default AttendeeConfirmation;
