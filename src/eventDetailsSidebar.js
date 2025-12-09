import React, { useState, useEffect } from "react";
import "./eventDetailsSidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Attendee from "./assets/Attendee.png";
import Energy from "./assets/Energy.png";
import Meal from "./assets/Meal.png";
import Material from "./assets/Material.png";
import Mydata from "./assets/Mydata.png";
import Waste from "./assets/Waste.png";
import Preplan from "./assets/Preplan.png";

const EventDetailsSidebar = ({ eventDetails, isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("");
  const [activeSubSection, setActiveSubSection] = useState("");

  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/events/Organizer")) {
      setActiveButton("Organizer");
      if (!path.includes("/Organizer-info")) {
        setActiveSubSection("Organizer-info");
        navigate("/events/Organizer/Organizer-info", {
          state: { eventDetails },
        });
      }
    } else if (path.includes("/during-event-planning")) {
      setActiveButton("during-event-planning");
      if (
        !path.includes("/attendee-details") &&
        !path.includes("/energy-consumption") &&
        !path.includes("/meal-consumption") &&
        !path.includes("/material-consumption")
      ) {
        setActiveSubSection("attendee-details");
        navigate("/events/during-event-planning/attendee-details", {
          state: { eventDetails },
        });
      }
    } else if (path.includes("/post-event-planning")) {
      setActiveButton("post-event-planning");
      if (!path.includes("/waste-generation")) {
        setActiveSubSection("waste-generation");
        navigate("/events/post-event-planning/waste-generation", {
          state: { eventDetails },
        });
      }
    } else if (path.includes("/pre-event-planning")) {
      setActiveButton("pre-event-planning");
      if (
        !path.includes("/pre-planning") &&
        !path.includes("/invitation-and-marketing") &&
        !path.includes("/meetinginfo") &&
        !path.includes("/add-meetings") &&
        !path.includes("/upload-meeting-summary") &&
        !path.includes("/meeting-list") &&
        !path.includes("/meeting-summary")
      ) {
        setActiveSubSection("pre-planning");
        navigate("/events/pre-event-planning/pre-planning", {
          state: { eventDetails },
        });
      }
    } else if (path.includes("/individual")) {
      setActiveButton("individual");
      if (!path.includes("/my-data")) {
        setActiveSubSection("my-data");
        navigate("/events/individual/my-data", { state: { eventDetails } });
      }
    } else if (path.includes("/events/report")) {
      setActiveButton("report");
      if (!path.includes("/events/report")) {
        setActiveSubSection("summary-report");
        navigate("/events/report", { state: { eventDetails } });
      }
    } else if (path.includes("/event-details")) {
      setActiveButton("Event Details");
      setActiveSubSection("");
    } else {
      setActiveButton("");
      setActiveSubSection("");
    }
  }, [location.pathname, navigate, eventDetails]);

  const handleButtonClick = (section, defaultSubSection) => {
    setActiveButton((prevSection) => (prevSection === section ? "" : section));
    setActiveSubSection(defaultSubSection);
    if (section === "pre-event-planning") {
      navigate(`/events/pre-event-planning/${defaultSubSection}`, {
        state: { eventDetails },
      });
    } else if (section === "during-event-planning") {
      navigate(`/events/during-event-planning/${defaultSubSection}`, {
        state: { eventDetails },
      });
    } else if (section === "post-event-planning") {
      navigate(`/events/post-event-planning/${defaultSubSection}`, {
        state: { eventDetails },
      });
    } else if (section === "individual") {
      navigate(`/events/individual/${defaultSubSection}`, {
        state: { eventDetails },
      });
    } else if (section === "report") {
      navigate(`/events/report/${defaultSubSection}`, {
        state: { eventDetails },
      });
    } else if (section === "Organizer") {
      navigate(`/events/Organizer/${defaultSubSection}`, {
        state: { eventDetails },
      });
    }
  };

  const handleSubSectionClick = (subSection, path) => {
    setActiveSubSection(subSection);
    navigate(path, { state: { eventDetails } });
  };

  const isMaterialConsumptionEnabled = eventDetails?.boundary?.includes(
    "Material Consumption"
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="Page_Menu_Wrp">
            <div
              className={`event-details-navbar ${
                isCollapsed ? "navbar-collapsed" : ""
              }`}
            >
              <ul>
                <li>
                  <Link
                    to="/events/event-details"
                    state={{ eventDetails }}
                    className={`navbar-link ${
                      activeButton === "Event Details" ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick("Event Details", "")}
                  >
                    Event Details
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events/pre-event-planning"
                    state={{ eventDetails }}
                    className={`navbar-link ${
                      activeButton === "pre-event-planning" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleButtonClick("pre-event-planning", "pre-planning")
                    }
                  >
                    Pre-Event Planning
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events/during-event-planning"
                    state={{ eventDetails }}
                    className={`navbar-link ${
                      activeButton === "during-event-planning" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleButtonClick(
                        "during-event-planning",
                        "attendee-details"
                      )
                    }
                  >
                    During Event Planning
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events/post-event-planning"
                    state={{ eventDetails }}
                    className={`navbar-link ${
                      activeButton === "post-event-planning" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleButtonClick(
                        "post-event-planning",
                        "waste-generation"
                      )
                    }
                  >
                    Post-Event Planning
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events/individual"
                    state={{ eventDetails }}
                    className={`navbar-link ${
                      activeButton === "individual" ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick("individual", "my-data")}
                  >
                    Attendee
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events/Organizer/Organizer-info"
                    state={{ eventDetails }}
                    className={`navbar-link ${
                      activeButton === "Organizer" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleButtonClick("Organizer", "Organizer-info")
                    }
                  >
                    Organizer
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events/report"
                    state={{ eventDetails }}
                    className={`navbar-link ${
                      activeButton === "report" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleButtonClick("report", "summary-report")
                    }
                  >
                    Report
                  </Link>
                </li>
              </ul>
            </div>

            <div className="sub-sections">
              {activeButton === "pre-event-planning" && (
                <ul>
                  <li>
                    <Link
                      to="/events/pre-event-planning/pre-planning"
                      state={{ eventDetails }}
                      className={
                        activeSubSection === "pre-planning" ? "active" : ""
                      }
                      onClick={() =>
                        handleSubSectionClick(
                          "pre-planning",
                          "/events/pre-event-planning/pre-planning"
                        )
                      }
                    >
                      <img src={Preplan} alt="Pre-Planning" />
                      Invitations & Marketing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/events/pre-event-planning/meeting-list"
                      state={{ eventDetails }}
                      className={
                        activeSubSection === "meeting-list" ? "active" : ""
                      }
                      onClick={() =>
                        handleSubSectionClick(
                          "meeting-list",
                          "/events/pre-event-planning/meeting-list"
                        )
                      }
                    >
                      <img src={Preplan} alt="Meeting Info" />
                      Meeting Info
                    </Link>
                  </li>
                </ul>
              )}
              {activeButton === "during-event-planning" && (
                <ul>
                  <li>
                    <Link
                      to="/events/during-event-planning/attendee-details"
                      state={{ eventDetails }}
                      className={
                        activeSubSection === "attendee-details" ? "active" : ""
                      }
                      onClick={() =>
                        handleSubSectionClick(
                          "attendee-details",
                          "/events/during-event-planning/attendee-details"
                        )
                      }
                    >
                      <img src={Attendee} alt="Attendee Details" />
                      Attendee Details
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/events/during-event-planning/energy-consumption"
                      state={{ eventDetails }}
                      className={
                        activeSubSection === "energy-consumption"
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handleSubSectionClick(
                          "energy-consumption",
                          "/events/during-event-planning/energy-consumption"
                        )
                      }
                    >
                      <img src={Energy} alt="Energy Consumption" />
                      Energy Consumption
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/events/during-event-planning/meal-consumption"
                      state={{ eventDetails }}
                      className={
                        activeSubSection === "meal-consumption" ? "active" : ""
                      }
                      onClick={() =>
                        handleSubSectionClick(
                          "meal-consumption",
                          "/events/during-event-planning/meal-consumption"
                        )
                      }
                    >
                      <img src={Meal} alt="Meal Consumption" />
                      Meal Consumption
                    </Link>
                  </li>
                  {isMaterialConsumptionEnabled && (
                    <li>
                      <Link
                        to="/events/during-event-planning/material-consumption"
                        state={{ eventDetails }}
                        className={
                          activeSubSection === "material-consumption"
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          handleSubSectionClick(
                            "material-consumption",
                            "/events/during-event-planning/material-consumption"
                          )
                        }
                      >
                        <img src={Material} alt="Material Consumption" />
                        Material Consumption
                      </Link>
                    </li>
                  )}
                </ul>
              )}
              {activeButton === "post-event-planning" && (
                <ul>
                  <li>
                    <Link
                      to="/events/post-event-planning/waste-generation"
                      state={{ eventDetails }}
                      className={
                        activeSubSection === "waste-generation" ? "active" : ""
                      }
                      onClick={() =>
                        handleSubSectionClick(
                          "waste-generation",
                          "/events/post-event-planning/waste-generation"
                        )
                      }
                    >
                      <img src={Waste} alt="Waste Generation" />
                      Waste Generation
                    </Link>
                  </li>
                </ul>
              )}
              {activeButton === "individual" && (
                <ul>
                  <li>
                    <Link
                      to="/events/individual/my-data"
                      state={{ eventDetails }}
                      className={activeSubSection === "my-data" ? "active" : ""}
                      onClick={() =>
                        handleSubSectionClick(
                          "my-data",
                          "/events/individual/my-data"
                        )
                      }
                    >
                      <img src={Mydata} alt="My Data" />
                      My Data
                    </Link>
                  </li>
                </ul>
              )}
              {activeButton === "Organizer" && (
                <ul>
                  <li>
                    <Link
                      to="/events/Organizer/Organizer-info"
                      state={{ eventDetails }}
                      className={
                        activeSubSection === "Organizer-info" ? "active" : ""
                      }
                      onClick={() =>
                        handleSubSectionClick(
                          "Organizer-info",
                          "/events/Organizer/Organizer-info"
                        )
                      }
                    >
                      <img src={Mydata} alt="Organizer Info" />
                      Organizer Info
                    </Link>
                  </li>
                </ul>
              )}
              {activeButton === "report" && (
                <ul>
                  <li>
                    <Link
                      to="/events/report/summary-report"
                      state={{ eventDetails }}
                      className={
                        activeSubSection === "summary-report" ? "active" : ""
                      }
                      onClick={() =>
                        handleSubSectionClick(
                          "summary-report",
                          "/events/report/summary-report"
                        )
                      }
                    >
                      <img src={Mydata} alt="Summary Report" />
                      Summary Report
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsSidebar;
