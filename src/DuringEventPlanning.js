import { useLocation, Route, Routes } from "react-router-dom";
import EcoIndex from "./EcoIndex";
import EventDetailsSidebar from "./eventDetailsSidebar";
import EnergyConsumption from "./EnergyConsumption";
import MealConsumption from "./MealConsumption";
import MaterialConsumption from "./MaterialConsumption";
import { useEvent } from "./EventDetailsContext";
import React, { useEffect } from "react";
import AttendeeDetails from "./attendeeDetails";
import AttendeeConfirmation from "./AttendeeConfirmation";
import "./DuringEventPlanning.css";
import AttendeeUploadPage from "./AttendeeUploadPage";

const DuringEventPlanning = () => {
  const location = useLocation();
  const { eventDetails, setEventDetails } = useEvent();

  useEffect(() => {
    if (location.state?.event) {
      setEventDetails(location.state.event);
    }
  }, [location.state, setEventDetails]);

  const isMaterialConsumptionEnabled = eventDetails?.boundary?.includes(
    "Material Consumption"
  );
  return (
    <div className="during-planning">
      <EcoIndex />
      <div className="main-content">
        <EventDetailsSidebar eventDetails={eventDetails} />
        <Routes>
          <Route path="energy-consumption" element={<EnergyConsumption />} />
          <Route path="meal-consumption" element={<MealConsumption />} />
          {isMaterialConsumptionEnabled && (
            <Route
              path="material-consumption"
              element={<MaterialConsumption />}
            />
          )}
          <Route path="attendee-details" element={<AttendeeConfirmation />} />
          <Route
            path="attendee-details/summary"
            element={<AttendeeDetails />}
          />
          <Route
            path="attendee-details/uploadsummary"
            element={<AttendeeUploadPage />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default DuringEventPlanning;
