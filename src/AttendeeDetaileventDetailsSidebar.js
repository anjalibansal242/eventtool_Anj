import React, { useState, useEffect } from "react";
import "./eventDetailsSidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Mydata from "./assets/Mydata.png";

const AttendeeDetaileventDetailsSidebar = ({ eventDetails, isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("");
  const [activeSubSection, setActiveSubSection] = useState("");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/during-event-planning")) {
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
        !path.includes("/meetings") &&
        !path.includes("/add-meetings") // Added condition for Add Meetings
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
    } else if (path.includes("/event-details")) {
      setActiveButton("Event Details");
      setActiveSubSection("");
    } else {
      setActiveButton("");
      setActiveSubSection(""); // Reset activeButton and activeSubSection if none match
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
    }
  };

  const handleSubSectionClick = (subSection, path) => {
    setActiveSubSection(subSection);
    navigate(path, { state: { eventDetails } });
  };

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
              </ul>
            </div>

            <div className="sub-sections">
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
                      My Information
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

export default AttendeeDetaileventDetailsSidebar;
