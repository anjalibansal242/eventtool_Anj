import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Mydata from "./assets/Mydata.png";

const OrganiserDetailsSidebar = ({ eventDetails, isCollapsed }) => {
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
    } else if (path.includes("/events/Organizer")) {
      setActiveButton("Organizer");
      if (!path.includes("/events/Organizer/Organizer-info")) {
        setActiveSubSection("Organizer-info");
        navigate("/events/Organizer/Organizer-info", {
          state: { eventDetails },
        });
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
    console.log("EventDetails before navigation: ", eventDetails);

    setActiveButton((prevSection) => (prevSection === section ? "" : section));
    setActiveSubSection(
      section === "Organizer" ? "Organizer-info" : defaultSubSection
    );
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

  const pageMenuStyle = {
    position: "fixed",
    top: 0,
    left: "200px",
    width: "calc(100% - 200px)",
    zIndex: 1000,
    background: "#f8f9fa",
    borderBottom: "1px solid #ced4da",
    marginBottom: 0,
  };

  const navbarStyle = {
    width: "100%",
    background: "#007272",
    color: "#ffffff",
    padding: "20px 20px 7px 20px",
    position: "relative",
  };

  const navbarListStyle = {
    margin: 0,
    padding: 0,
    listStyle: "none",
  };

  const navbarItemStyle = {
    display: "inline-block",
  };

  const navbarLinkStyle = (isActive) => ({
    color: "#ffffff",
    fontSize: "13px",
    padding: "10px 10px",
    textDecoration: "none",
    marginRight: "10px",
    fontWeight: 600,
    background: isActive ? "#ffffff" : "transparent",
    color: isActive ? "#000000" : "#ffffff",
  });

  const subSectionsStyle = {
    width: "calc(100% - 200px)",
    background: "#ffffff",
    color: "#ffffff",
    padding: "10px 0px 3px 20px",
    border: "1px solid #ced4da",
    borderBottom: "none",
    position: "relative",
  };

  const subSectionLinkStyle = (isActive) => ({
    color: "#000000",
    textDecoration: "none",
    marginRight: "10px",
    fontSize: "13px",
    background: "#ffffff",
    borderTopLeftRadius: "3px",
    borderTopRightRadius: "3px",
    padding: "5px 10px",
    fontWeight: 600,
    background: isActive ? "#007272" : "#ffffff",
    color: isActive ? "#ffffff" : "#000000",
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="Page_Menu_Wrp">
            <div style={pageMenuStyle}>
              <div style={navbarStyle}>
                <ul style={navbarListStyle}>
                  <li style={navbarItemStyle}>
                    <Link
                      to="/events/event-details"
                      state={{ eventDetails }}
                      style={navbarLinkStyle(activeButton === "Event Details")}
                      onClick={() => handleButtonClick("Event Details", "")}
                    >
                      Event Details
                    </Link>
                  </li>
                  <li style={navbarItemStyle}>
                    <Link
                      to="/events/individual"
                      state={{ eventDetails }}
                      style={navbarLinkStyle(activeButton === "individual")}
                      onClick={() => handleButtonClick("individual", "my-data")}
                    >
                      Attendee
                    </Link>
                  </li>
                  <li style={navbarItemStyle}>
                    <Link
                      to="/events/Organizer"
                      state={{ eventDetails }}
                      style={navbarLinkStyle(activeButton === "Organizer")}
                    >
                      Organizer
                    </Link>
                  </li>
                </ul>
              </div>

              <div style={subSectionsStyle}>
                {activeButton === "individual" && (
                  <ul>
                    <li>
                      <Link
                        to="/events/individual/my-data"
                        state={{ eventDetails }}
                        style={subSectionLinkStyle(
                          activeSubSection === "my-data"
                        )}
                        onClick={() =>
                          handleSubSectionClick(
                            "my-data",
                            "/events/individual/my-data"
                          )
                        }
                      >
                        <img
                          src={Mydata}
                          alt="My Data"
                          style={{ width: "20px", display: "none" }}
                        />
                        My Information
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
                        style={subSectionLinkStyle(
                          activeSubSection === "Organizer-info"
                        )}
                        onClick={() =>
                          handleSubSectionClick(
                            "Organizer-info",
                            "/events/Organizer/Organizer-info"
                          )
                        }
                      >
                        Organizer Information
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganiserDetailsSidebar;
