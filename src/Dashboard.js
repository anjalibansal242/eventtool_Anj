// Dashboard.js
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import EcoIndex from "./EcoIndex";
import DoughnutChart from "./DoughnutChart";
import DoughnutChart2 from "./DoughnutChart2";
import DoughnutChart3 from "./DoughnutChart3";
import AttendeeDashboard from "./AttendeeDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import AttendeePieChart from "./AttendeePieChart";
import OrganizerPieChart from "./OrganizerPieChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMaskVentilator,
  faUser,
  faBolt,
  faDroplet,
  faWeightScale,
  faPlus,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  getDashboardData,
  getEventNameList,
  useApi,
  getEventList,
} from "./apiService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedRole, setSelectedRole] = useState("Select Role");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const api = useApi();
  const [availableroles, setAvailableRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEventList();
        const uniqueRoles = [...new Set(response.map((role) => role.myRole))];
        setAvailableRoles(uniqueRoles);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddEventClick = () => {
    navigate("/new-event");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (selectedRole) {
          const eventList = await getEventNameList(selectedRole);
          setEvents(eventList);

          if (eventList.length > 0) {
            setSelectedEvent(eventList[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, [selectedRole]);

  useEffect(() => {
    if (selectedEvent && selectedEvent.eventId) {
      const fetchDashboardData = async () => {
        setLoading(true);
        try {
          console.log("Selected Event:", selectedEvent);
          const data = await getDashboardData(selectedEvent.eventId);
          console.log("Dashboard Data: ", data);
          setDashboardData(data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [selectedEvent]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setShowEventDropdown(false);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleDropdown(false);
  };

  return (
    <div className="dashboard">
      <EcoIndex />
      <div className="main-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="my-events-navbar">
                <div className="my-events-text">
                  <h2>DASHBOARD</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="White_Box">
                <div className="row">
                  <div className="col-md-6 d-flex align-items-center">
                    <div className="dropdown-container">
                      <button
                        className="btn SelectRoleBtn"
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      >
                        {selectedRole}
                        <FontAwesomeIcon icon={faCaretDown} className="icon" />
                      </button>
                      {showRoleDropdown && (
                        <div className="dropdown-content">
                          <ul>
                            {availableroles.map((role) => (
                              <li onClick={() => handleRoleSelect(role)}>
                                {role}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="dropdown-container ml-2">
                      {events.length > 0 && (
                        <button
                          className="btn SelectEventBtn"
                          onClick={() =>
                            setShowEventDropdown(!showEventDropdown)
                          }
                        >
                          {selectedEvent
                            ? selectedEvent.eventName
                            : "Select Event"}
                          <FontAwesomeIcon
                            icon={faCaretDown}
                            className="icon"
                          />
                        </button>
                      )}
                      {showEventDropdown && (
                        <div className="dropdown-content">
                          <ul>
                            {events.map((event) => (
                              <li
                                key={event.eventId}
                                onClick={() => handleEventSelect(event)}
                              >
                                {event.eventName}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 d-flex justify-content-end align-items-center">
                    <div className="dropdown-container">
                      <button
                        className="btn AddEventBtn"
                        onClick={handleAddEventClick}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add Event
                      </button>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <hr></hr>
                  </div>
                </div>
                {loading && <p>Loading...</p>}
                {error && <p>Error loading data</p>}
                {dashboardData && selectedRole === "Event Manager" && (
                  <div className="row">
                    <div className="col">
                      <div className="DashbordNoBox">
                        <p>
                          <FontAwesomeIcon
                            icon={faMaskVentilator}
                            className="icon-shadow"
                          />
                        </p>
                        <h2>
                          Total Estimated <br></br>Carbon Emission
                        </h2>
                        <p className="text-center">
                          <span className="number">
                            {dashboardData.totalEstimatedCarbonEmission}
                          </span>{" "}
                          <span className="value-sub">KgCO₂</span>
                        </p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="DashbordNoBox">
                        <p>
                          <FontAwesomeIcon
                            icon={faUser}
                            className="icon-shadow"
                          />
                        </p>
                        <h2>
                          Total number of <br></br>Attendees
                        </h2>
                        <p className="number">
                          {dashboardData.totalNoOfAttendee}
                        </p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="DashbordNoBox">
                        <p>
                          <FontAwesomeIcon
                            icon={faBolt}
                            className="icon-shadow"
                          />
                        </p>
                        <h2>
                          Emission in Energy <br></br>Consumption
                        </h2>

                        <p className="text-center">
                          <span className="number">
                            {dashboardData.emissionInEnergyConsumption}
                          </span>{" "}
                          <span className="value-sub">KgCO₂</span>
                        </p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="DashbordNoBox">
                        <p>
                          <FontAwesomeIcon
                            icon={faDroplet}
                            className="icon-shadow"
                          />
                        </p>
                        <h2>
                          Water<br></br> Consumption
                        </h2>

                        <p className="text-center">
                          <span className="number">
                            {dashboardData.emissionInWaterConsumption}
                          </span>{" "}
                          <span className="value-sub">Litres</span>
                        </p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="DashbordNoBox">
                        <p>
                          <FontAwesomeIcon
                            icon={faWeightScale}
                            className="icon-shadow"
                          />
                        </p>
                        <h2>
                          Per Capita<br></br> Emission
                        </h2>

                        <p className="text-center">
                          <span className="number">
                            {dashboardData.perCapitaEmission}
                          </span>{" "}
                          <span className="value-sub">KgCO₂</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {dashboardData && selectedRole === "Attendee" && (
                  <div className="row mt-3">
                    <div className="col">
                      <AttendeeDashboard eventId={selectedEvent.eventId} />
                    </div>
                  </div>
                )}
                {dashboardData && selectedRole === "Organizer" && (
                  <div className="row mt-3">
                    <div className="col">
                      <OrganizerDashboard eventId={selectedEvent.eventId} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedEvent.eventId && (
           <div className="row mt-2">
           <div className="col-md-12">
             <div className="White_Box">
               <div className="row d-flex justify-content-center">
                 {selectedRole === "Event Manager" && (
                   <>
                     <div className="col-md-4">
                       <DoughnutChart eventId={selectedEvent.eventId} />
                     </div>
                     <div className="col-md-4">
                       <DoughnutChart2 eventId={selectedEvent.eventId} />
                     </div>
                     <div className="col-md-4">
                       <DoughnutChart3 eventId={selectedEvent.eventId} />
                     </div>
                   </>
                 )}
                 {selectedRole === "Attendee" && (
                   <>
                     <div className="col-md-6 mx-auto">
                       <AttendeePieChart eventId={selectedEvent.eventId} />
                     </div>
                   </>
                 )}
                 {selectedRole === "Organizer" && (
                   <>
                     <div className="col-md-4">
                       <AttendeePieChart eventId={selectedEvent.eventId} />
                     </div>
                     <div className="col-md-4">
                       <OrganizerPieChart eventId={selectedEvent.eventId} />
                     </div>
                   </>
                 )}
               </div>
             </div>
           </div>
         </div>
         
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
