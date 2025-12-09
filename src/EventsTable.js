import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEventList, deleteEvent, useApi } from "./apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSort, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../src/assets/styles/bootstrap-4.4.1.css";
import "../src/assets/styles/style.css";
import "./EventsTable.css";
import EcoIndex from "./EcoIndex";
import MyEventsNavbar from "./MyEventsNavbar";
import "./EcoIndex.css";
import { useAuth } from "./AuthProvider";
import CustomAlert from "./CustomAlert"; 


const EventsTable = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { accessToken } = useAuth();
  const api = useApi();

  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [confirmationAction, setConfirmationAction] = useState(null);

  const handleAddEventClick = () => {
    navigate("/new-event");
  }; 

  const handleEditEventClick = (event) => {
    console.log("Navigating with event data:", event);

    if (event.myRole === "Attendee") {
      navigate("/events/individual", { state: { event } });
    } else if (event.myRole === "Organizer") {
      console.log("state of event: ",event);
      navigate("/events/Organizer/Organizer-info", { state: { event } });
    } else {
      navigate("/events/during-event-planning", { state: { event } });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(events.length / eventsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCheckBoxChange = (eventId) => {
    setSelectedEvents((prevSelectedEvents) => {
      if (prevSelectedEvents.includes(eventId)) {
        return prevSelectedEvents.filter((id) => id !== eventId);
      } else {
        return [...prevSelectedEvents, eventId];
      }
    });
  };

  const isEventManager = (role) => {
    return role === "Event Manager";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEventList();
        setEvents(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loaderwrpOuter">
      <div className="loaderwrp"></div>
      <p>Loading...</p>
      </div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handleSelectAllChange = () => {
    setSelectAll((prevSelectAll) => {
      const newSelectAll = !prevSelectAll;
      if (newSelectAll) {
        setSelectedEvents((prevSelectedEvents) => [
          ...new Set([
            ...prevSelectedEvents,
            ...currentEvents
              .filter((event) => isEventManager(event.myRole))
              .map((event) => event.eventId),
          ]),
        ]);
      } else {
        setSelectedEvents((prevSelectedEvents) =>
          prevSelectedEvents.filter(
            (id) =>
              !currentEvents
                .filter((event) => isEventManager(event.myRole))
                .map((event) => event.eventId)
                .includes(id)
          )
        );
      }
      return newSelectAll;
    });
  };

  const handleDeleteEvents = () => {
    if (selectedEvents.length === 0) {
      setAlertMessage("Please select an event");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    setAlertMessage("Are you sure you want to delete the selected events?");
    setAlertType("warning");
    setShowAlert(true);
    setConfirmationAction(() => confirmDelete);
  };

  const confirmDelete = async () => {
    try {
      await deleteEvent(selectedEvents);
      const response = await getEventList();
      setEvents(response);
      setSelectedEvents([]);
      setAlertMessage("Selected events deleted successfully.");
      setAlertType("success");
    } catch (error) {
      console.error("Error deleting events:", error);
      setAlertMessage("An error occurred while deleting events.");
      setAlertType("error");
    } finally {
      setShowAlert(true); // Ensure showAlert is set to true to show the alert
      setConfirmationAction(null);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === 'success') {
      navigate("/events");
    }
  };

  return (
 <div className="new-event-page">
  <EcoIndex />

  <div className="main-content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <MyEventsNavbar />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="White_Box">
            <div className="row mb-2">
              <div className="col-md-6">
                <div className="sort-delete-container">
                  <span>
                    <div className="deleteBtn-container">
                      <i
                        className="fa fa-trash"
                        aria-hidden="true"
                        onClick={handleDeleteEvents}
                      ></i>
                      <span className="delete-tooltip">Delete</span>
                    </div>
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <button className="btn AddEventBtn" onClick={handleAddEventClick}>
                  <FontAwesomeIcon icon={faPlus} /> Add Event
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th align="center">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                          />
                        </th>
                        <th>Event Name</th>
                        <th>Start Date</th>
                        <th>Type of Event</th>
                        <th>Location</th>
                        <th>Total Participants</th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEvents.length > 0 ? (
                        currentEvents.map((item, index) => (
                          <tr key={item.eventId} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                            <td align="center">
                              {isEventManager(item.myRole) && (
                                <input
                                  type="checkbox"
                                  checked={selectedEvents.includes(item.eventId)}
                                  onChange={() => handleCheckBoxChange(item.eventId)}
                                />
                              )}
                            </td>
                            <td>{item.eventName}</td>
                            <td>{item.startDate}</td>
                            <td>{item.eventType}</td>
                            <td>{item.location}</td>
                            <td>{item.participantCount}</td>
                            <td>{item.myRole}</td>
                            <td>
                              <button className="btn edit-button" onClick={() => handleEditEventClick(item)}>
                                Update
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="no-record">
                            No Record Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="PageNo">
                  Showing: {currentEvents.length} of {events.length} events
                </div>
              </div>
              <div className="col-md-6">
                <div className="pagination">
                  <button className="page-button" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    &lt;
                  </button>
                  <span>{currentPage}</span>
                  <button className="page-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {showAlert && (
    <CustomAlert
      message={alertMessage}
      type={alertType}
      onClose={handleCloseAlert}
      onConfirm={confirmationAction}
    />
  )}
</div>

  );
};

export default EventsTable;
