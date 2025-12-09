// src/PreEventPlanning.js
import { useLocation, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
import EcoIndex from "./EcoIndex";
import EventDetailsSidebar from "./eventDetailsSidebar";
import PrePlanning from "./PrePlanning";
import MeetingInfo from "./components/meetings/MeetingInfo";
import AddMeeting from "./components/meetings/AddMeeting";
import MeetingList from "./components/meetings/MeetingList";
import UploadMeetingSummary from "./components/meetings/UploadMeetingSummary";
import "./PreEventPlanning.css";
import { useEvent } from "./EventDetailsContext";
import MeetingSummary from "./components/meetings/MeetingSummary";

const PreEventPlanning = () => {
  const location = useLocation();
  const { eventDetails, setEventDetails } = useEvent();

  useEffect(() => {
    if (location.state?.event) {
      setEventDetails(location.state.event);
    }
  }, [location.state, setEventDetails]);

  return (
    <div className="pre-planning">
      <EcoIndex />
      <div className="main-content">
        <EventDetailsSidebar eventDetails={eventDetails} />
        <Routes>
          <Route path="pre-planning" element={<PrePlanning />} />
          <Route path="/meetinginfo/*" element={<MeetingInfo />} />
          <Route path="/add-meetings" element={<AddMeeting />} /> 
          <Route path="/meeting-list" element={<MeetingList />} />
          <Route path="/upload-meeting-summary" element={<UploadMeetingSummary />} />
          <Route path="/meeting-summary" element={<MeetingSummary />} />

        
        </Routes>
      </div>
    </div>
  );
}

export default PreEventPlanning;
