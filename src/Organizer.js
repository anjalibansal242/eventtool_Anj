import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import EcoIndex from "./EcoIndex";
import OrganizerDetailsSidebar from "./OragniserDetailsSidebar"; // Corrected Typo
import OrganizerData from "./OrganizerData";
import { useEvent } from "./EventDetailsContext";
import AttendeeDetaileventDetailsSidebar from "./AttendeeDetaileventDetailsSidebar"; // Corrected Typo
import EventDetailsSidebar from "./eventDetailsSidebar"; // Assuming you meant this
import './Organizer.css';

const Organizer = () => {
  const { eventDetails, setEventDetails } = useEvent();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.event) {
      setEventDetails(location.state.event);
    }
  }, [location.state, setEventDetails]);

  if (!eventDetails) {
    return <div>Loading event details...</div>;
  }

  return (
    <div className="organizer">
    <EcoIndex />
    <div className="main-content">
      {eventDetails.myRole === "Attendee" ? (
        <AttendeeDetaileventDetailsSidebar eventDetails={eventDetails} />
      ) : eventDetails.myRole === "Organizer" ? (
        <OrganizerDetailsSidebar eventDetails={eventDetails} />
      ) : eventDetails.myRole ? (
        <EventDetailsSidebar eventDetails={eventDetails} />
      ) : (
        <div>No Sidebar Available</div> 
      )}
      <Routes>
        <Route path="Organizer-info" element={<OrganizerData eventDetails={eventDetails} />} />
      </Routes>
    </div>
  </div>
);
};

export default Organizer;
