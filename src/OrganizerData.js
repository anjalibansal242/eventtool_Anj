import React, { useState, useEffect, useRef, useCallback } from "react";
import CustomAlert from "./CustomAlert";
import { useEvent } from "./EventDetailsContext";
import "./OrganizerData.css";
import { useNavigate } from "react-router-dom";
import EventName from "./EventName";
import {
  getIndividualMeetingConsumptionDetails,
  addUpdateIndividualMeetingData,
  getUserMeetingList,
  getMeetingList,
  useApi,
} from "./apiService";

const OrganizerData = () => {
  const locationRef = useRef(null);
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const api = useApi();
  const { eventDetails } = useEvent();
  const [showForm, setShowForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [formData, setFormData] = useState({
    travelMode: "",
    transportationType: "",
    startingLocation: "",
    hotelType: "NA",
    mealPreference: "Veg",
    eventDuration: "1 Days",
    transportationTypeOptions: [],
  });
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMeetingName, setSelectedMeetingName] = useState("");
  const [placeSelected, setPlaceSelected] = useState(false); 

  const travelModeMapping = {
    Car: {
      Diesel: 1,
      Petrol: 2,
      CNG: 3,
      Electric: 4,
    },
    Bus: {
      "Fuel-Based": 5,
      Electric: 7,
    },
    Train: {
      Train: 6,
    },
    Flight: {
      Economy: 8,
      Business: 13,
    },
  };

  const hotelTypeMapping = {
    "3-Star": 1,
    "4-Star": 2,
    "5-Star": 3,
    NA: 4,
  };
  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      try {
        if (!eventDetails || !eventDetails.eventId) {
          throw new Error("Event details not available");
        }

        let data;
        if (eventDetails.myRole === "Event Manager") {
          data = await getMeetingList(eventDetails.eventId);
        } else if (eventDetails.myRole === "Organizer") {
          data = await getUserMeetingList(eventDetails.eventId);
        }

        if (data && Array.isArray(data)) {
          setMeetings(data);
        } else {
          setMeetings([]);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, [eventDetails?.eventId, eventDetails?.myRole]);

  console.log("loadingsee", loading);
  useEffect(() => {
    if (selectedMeetingId !== null) {
      const fetchMeetingDetails = async () => {
        setLoading(true);
        try {
          const data = await getIndividualMeetingConsumptionDetails(
            selectedMeetingId
          );
          console.log("Fetched Meeting Consumption Details:", data);

          if (data && Object.keys(data).length > 0) {
            const travelModeKey = Object.keys(travelModeMapping).find((mode) =>
              Object.values(travelModeMapping[mode]).includes(data.travelModeId)
            );

            const transportationTypeKey = travelModeKey
              ? Object.keys(travelModeMapping[travelModeKey]).find(
                  (type) =>
                    travelModeMapping[travelModeKey][type] === data.travelModeId
                )
              : "";

            setFormData({
              travelMode: travelModeKey || "",
              transportationType: transportationTypeKey || "",
              startingLocation: data.location || "",
              hotelType:
                Object.keys(hotelTypeMapping).find(
                  (key) => hotelTypeMapping[key] === data.accommodationId
                ) || "NA",
              transportationTypeOptions: travelModeKey
                ? Object.keys(travelModeMapping[travelModeKey])
                : [],
            });

            setSelectedMeetingName(data.name);
          } else {
            setFormData({
              travelMode: "",
              transportationType: "",
              startingLocation: "",
              hotelType: "NA",
              mealPreference: "Veg",
              eventDuration: "1 Days",
              transportationTypeOptions: [],
            });
          }
        } catch (error) {
          console.error("Error fetching meeting details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMeetingDetails();
    }
  }, [selectedMeetingId]);

  useEffect(() => {
    if (showForm) {
      const initializeAutocomplete = () => {
        console.log("Initializing Google Maps Autocomplete...");
        const locationInput = locationRef.current;

        const autocomplete = new window.google.maps.places.Autocomplete(
          locationInput,
          {
            strictBounds: false,
          }
        );

        autocomplete.setFields([
          "formatted_address",
          "geometry.location",
          "name",
          "place_id",
        ]);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) {
            setPlaceSelected(false);             return;
          }
          console.log(place);
          setPlaceSelected(true); 
          setLocation(place.formatted_address);
          setFormData((prevFormData) => ({
            ...prevFormData,
            startingLocation: place.formatted_address,
            locationId: place.place_id,
          }));
        });
      };

      initializeAutocomplete();
    }
  }, [showForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      const newFormData = { ...prevState, [name]: value };

      if (name === "travelMode") {
        const options = Object.keys(travelModeMapping[value] || {});
        newFormData.transportationTypeOptions = options;
        newFormData.transportationType = options[0] || "";
        newFormData.transportationTypeId = travelModeMapping[value]
          ? travelModeMapping[value][options[0]]
          : 0;
      }

      if (name === "transportationType") {
        const selectedTravelMode = newFormData.travelMode;
        const selectedTypeId =
          travelModeMapping[selectedTravelMode][value] || 0;
        newFormData.transportationTypeId = selectedTypeId;
      }

      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!placeSelected) {
      setAlertMessage(
        "All fields must be filled, and location must be selected from suggestions."
      );
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    const apiData = {
      MeetingId: selectedMeetingId,
      EventId: eventDetails.eventId || 256,
      UserEmail: eventDetails.createdBy || "",
      TravelModeId:
        travelModeMapping[formData.travelMode][formData.transportationType] ||
        0,
      Location: {
        location: formData.startingLocation || "",
        locationId: 0,
      },
      AccommodationId: hotelTypeMapping[formData.hotelType] || 0,
    };

    console.log("Submitting Data:", apiData);

    try {
      const response = await addUpdateIndividualMeetingData(apiData);
      console.log("Data saved successfully:", apiData);
      setAlertMessage("Data saved successfully");
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Failed to save data:", error);
      setAlertMessage(
        "Error saving data. Please check your inputs and try again."
      );
      setAlertType("error");
      setShowAlert(true);
    }
  };

  const handleGoClick = useCallback(
    (meetingId, meetingName) => {
      if (loading) return;

      if (meetingId !== selectedMeetingId) {
        setShowForm(false); // Hide form before fetching new data
        setSelectedMeetingId(meetingId); // This will trigger the useEffect to fetch new meeting data
        setSelectedMeetingName(meetingName);
        setFormData({
          travelMode: "",
          transportationType: "",
          startingLocation: "",
          hotelType: "NA",
          mealPreference: "Veg",
          eventDuration: "1 Days",
          transportationTypeOptions: [],
        });
        setShowForm(true); // Show form after data is fetched
      }
    },
    [loading, selectedMeetingId]
  );
console.log("selectedMeetingName",selectedMeetingName);
  const handleCloseAlert = () => {
    setShowAlert(false);
    setFormData({
      travelMode: "",
      transportationType: "",
      startingLocation: "",
      hotelType: "NA",
      mealPreference: "Veg",
      eventDuration: "1 Days",
      transportationTypeOptions: [],
    });
    setSelectedMeetingId(null);
    setSelectedMeetingName(""); 
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  console.log("meetings",meetings);


  return (
<div>
  <div className="form-container">
    <div className="event-name-container">
      <EventName />
    </div>

<div className="meeting-list">
  <table>
    <thead>
      <tr>
        <th>Meeting Name</th>
        <th>Meeting Date</th>
        <th>
          {eventDetails && eventDetails.myRole === "Event Manager" ? "" : "Created By"}
        </th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan="4">Loading meetings...</td>
        </tr>
      ) : meetings.length > 0 ? (
        meetings.map((meeting, index) => (
          <tr key={index}>
            <td>{meeting.name}</td>
            <td>{formatDate(meeting.meetingStartDate)}</td>
            <td>
              {eventDetails && eventDetails.myRole !== "Event Manager"
                ? meeting.createdBy
                : ""}
            </td>
            <td>
              <button
                className="go-button"
                onClick={() => handleGoClick(meeting.id, meeting.name)}
              >
                Go
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4">No Meetings Available</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{showForm && (
  <form onSubmit={handleSubmit}>
    <div className="selected-meeting-name">
      <h3>Meeting Name: {selectedMeetingName}</h3>
    </div>
    {/* Form content */}
    <div className="form-row">
      <div className="form-group">
        <label>How will you travel to the Event?</label>
        <select
          id="travelMode"
          name="travelMode"
          value={formData.travelMode}
          onChange={handleChange}
          required
        >
          <option value="">Select Travel Mode</option>
          {Object.keys(travelModeMapping).map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Type of Transportation</label>
        <select
          id="transportationType"
          name="transportationType"
          value={formData.transportationType}
          onChange={handleChange}
          required
          disabled={!formData.transportationTypeOptions.length}
        >
          <option value="">Select Transportation Type</option>
          {formData.transportationTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Starting Location</label>
        <input
          ref={locationRef}
          type="text"
          name="startingLocation"
          value={formData.startingLocation}
          onChange={(e) =>
            setFormData({
              ...formData,
              startingLocation: e.target.value,
            })
          }
          placeholder="Enter location"
          required
        />
      </div>

      <div className="form-group">
        <label>Hotel Type</label>
        <select
          id="hotelType"
          name="hotelType"
          value={formData.hotelType}
          onChange={handleChange}
          required
        >
          <option value="NA">NA</option>
          {Object.keys(hotelTypeMapping).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>

    <button type="submit" className="submit-button">
      Save
    </button>
  </form>
)}

{showAlert && (
  <CustomAlert
    message={alertMessage}
    type={alertType}
    onClose={handleCloseAlert}
  />
)}

</div>
</div>

  );
};

export default OrganizerData;
