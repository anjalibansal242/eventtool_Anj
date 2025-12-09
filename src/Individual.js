import { useLocation, Route, Routes } from "react-router-dom";
import EcoIndex from "./EcoIndex";
import EventDetailsSidebar from "./eventDetailsSidebar";
import AttendeeDetaileventDetailsSidebar from "./AttendeeDetaileventDetailsSidebar";
import MyData from "./MyData";
import "./Individual.css";
import React, { useEffect } from "react";
import { useEvent } from "./EventDetailsContext";
import OrganiserDetailsSidebar from "./OragniserDetailsSidebar";

const Individual = () => {
  const location = useLocation();
  const { eventDetails, setEventDetails } = useEvent();

  useEffect(() => {
    if (location.state?.event) {
      setEventDetails(location.state.event);
    }
  }, [location.state, setEventDetails]);

  if (!eventDetails) {
    return <div>Loading event details...</div>;
  }

  return (
    <div className="individual">
      <EcoIndex />

      <div className="main-content">
        {eventDetails?.myRole === "Attendee" ? (
          <AttendeeDetaileventDetailsSidebar eventDetails={eventDetails} />
        ) : eventDetails.myRole === "Organizer" ? (
          <OrganiserDetailsSidebar eventDetails={eventDetails} />
        ) : (
          <EventDetailsSidebar eventDetails={eventDetails} />
        )}

        <Routes>
          <Route
            path="my-data"
            element={<MyData eventDetails={eventDetails} />}
          />
          {/* Add other routes here */}
        </Routes>
      </div>
    </div>
  );
};

export default Individual;
