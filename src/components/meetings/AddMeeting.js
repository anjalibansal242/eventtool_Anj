import "./AddMeeting.css";
import React, { useState, useRef, useEffect } from "react";
import { useEvent } from "../../EventDetailsContext";
import {
  addMeeting,
  updateMeeting,
  updateMeetingInviteeList,
} from "../../apiService";
import UploadSpreadsheetButton from "../../UploadSpreadsheetButton";
import { useNavigate, useLocation } from "react-router-dom";
import EventName from "../../EventName";
import CustomAlert from "../../CustomAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);

const AddMeeting = () => {
  const [nameError, setNameError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const meeting = location.state ? location.state.meeting : null;
  const { eventDetails } = useEvent();
  console.log("meeting", location.state);

  const [meetingType, setMeetingType] = useState("offline");
  const [meetingData, setMeetingData] = useState({
    name: "",
    duration: "15",
    meetingStartDate: "",
    meetingEndDate: "",
    locationAddress: "",
    meetingtype: "offline",
    organizerCount: "",
    mealType: {
      Breakfast: false,
      Lunch: false,
      HighTea: false,
      Dinner: false,
    },
  });
  const [uploadedMeetingId, setuploadedMeetingId] = useState(0);
  const [uploadedInviteeListId, setUploadedInviteeListId] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState("");
  const locationInputRef = useRef(null);
  const [locationValue, setLocationValue] = useState("");
  const [locationId, setLocationId] = useState(0);
  const [datevalidation, setDateValidation] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [ViewUploadInviteeInfo, setViewUploadInviteeInfo] = useState(false);
  const [OfflinesuccessMessage, setOfflinesuccessMessage] = useState(null);
  const [OfflineinputBox, setOfflineinputBox] = useState(false);
  const [locationexist, setLocationExist]=useState(true);

  useEffect(() => {
    if (meeting) {
      setMeetingData({
        name: meeting.name,
        duration: meeting.duration.toString(),
        meetingStartDate: meeting.meetingStartDate.split("T")[0],
        meetingEndDate: meeting.meetingEndDate
          ? meeting.meetingEndDate.split("T")[0]
          : "",
        locationAddress: meeting.location,
        meetingtype: meeting.meetingType.toLowerCase(),
        organizerCount: meeting.organizerCount.toString(),
        mealType: {
          Breakfast: meeting.mealType.includes("Breakfast"),
          Lunch: meeting.mealType.includes("Lunch"),
          HighTea: meeting.mealType.includes("High-Tea"),
          Dinner: meeting.mealType.includes("Dinner"),
        },
      });
      setLocationId(meeting.locationId);
      setLocationValue(meeting.location);
      setUploadedInviteeListId(meeting.uploadedInviteeListId);
      setSelectedFileName(meeting.uploadedFileName);
      setMeetingType(meeting.meetingType.toLowerCase());
    }
  }, [meeting]);

  useEffect(() => {
    const initializeAutocomplete = () => {
      const locationInput = locationInputRef.current;
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
          setDateValidation("Please select a valid location before saving");
          setLocationExist(false);
          return;
        }
        setLocationExist(true);
        setDateValidation(null);

        setLocationValue(place.formatted_address);
        setMeetingData((prevFormData) => ({
          ...prevFormData,
          locationAddress: place.formatted_address,
        }));
      });
    };

    // Function to load the Google Maps API script
    const loadGoogleMapsApi = () => {
      const existingScript = document.querySelector(
        'script[src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places"]'
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeAutocomplete;
        document.head.appendChild(script);
      } else {
        initializeAutocomplete();
      }
    };

    if (meetingType === "offline") {
      if (window.google && window.google.maps) {
        initializeAutocomplete();
      } else {
        loadGoogleMapsApi();
      }
    }
  }, [meetingType]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (!validateName(value)) {
        setNameError("Name can only contain alphabets.");
      } else {
        setNameError("");
      }
    }
    setMeetingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMealChange = (e) => {
    const { name, checked } = e.target;
    setMeetingData((prevData) => ({
      ...prevData,
      mealType: {
        ...prevData.mealType,
        [name]: checked,
      },
    }));
  };

  const handleMeetingTypeChange = (e) => {
    const newMeetingType = e.target.value;
    setMeetingType(newMeetingType);
    setMeetingData((prevData) => ({
      ...prevData,
      meetingtype: newMeetingType,
      locationAddress: newMeetingType === "offline" ? locationValue : "", // Ensure location is set correctly
    }));
  };

  const handleUploadSuccess = async (uploadResponse) => {
    setUploadedInviteeListId(uploadResponse.id);
    setSelectedFileName(uploadResponse.fileName);
    if (uploadedMeetingId !== 0) {
      const updateData = {
        UploadedInviteeListID: uploadResponse.id,
        MeetingId: uploadedMeetingId,
      };
      try {
        const apiResponse = await updateMeetingInviteeList(updateData);
        console.log("update excel API response:", apiResponse);
      } catch (error) {
        console.error("Error updating meeting invitee list:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateName(meetingData.name)) {
      setDateValidation("Please enter a valid name.");
      return;
    }
    if (!locationexist) { 
      return; 
    }
    const mealsServedArray = [];
    if (meetingData.mealType.Breakfast) mealsServedArray.push("Breakfast");
    if (meetingData.mealType.Lunch) mealsServedArray.push("Lunch");
    if (meetingData.mealType.HighTea) mealsServedArray.push("High-Tea");
    if (meetingData.mealType.Dinner) mealsServedArray.push("Dinner");
    const mealsToSend = mealsServedArray.join("|");

    const MeetingPost = {
      EventId: eventDetails.eventId,
      Name: meetingData.name,
      Duration: Number(meetingData.duration),
      MeetingStartDate: meetingData.meetingStartDate,
      MeetingEndDate:
        meetingData.meetingEndDate || meetingData.meetingStartDate,
      Location: { Location: meetingData.locationAddress, LocationId: 0 },
      MeetingType: meetingData.meetingtype,
      OrganizerCount: Number(meetingData.organizerCount),
      MealType: mealsToSend,
      UploadedInviteeList: {
        UploadedInviteeListId: uploadedInviteeListId,
        FileName: selectedFileName,
      },
    };

    const UpdateMeetingPost = meeting
      ? {
          Id: meeting.id,
          EventId: eventDetails.eventId,
          Name: meetingData.name,
          Duration: Number(meetingData.duration),
          MeetingStartDate: meetingData.meetingStartDate,
          MeetingEndDate:
            meetingData.meetingEndDate || meetingData.meetingStartDate,
          Location: meetingData.locationAddress,
          LocationId: locationId,
          MeetingType: meetingData.meetingtype,
          OrganizerCount: Number(meetingData.organizerCount),
          MealType: mealsToSend,
          UploadedInviteeListId: uploadedInviteeListId,
          UploadedFileName: selectedFileName,
        }
      : null;

    try {
      let response;
      if (meeting) {
        response = await updateMeeting(UpdateMeetingPost);
      } else {
        response = await addMeeting(MeetingPost);
      }

      if (response.eventId === eventDetails.eventId) {
        if (meetingType === "online" || meeting) {
          setSuccessMessage(
            meeting
              ? "Meeting updated successfully!"
              : "Meeting added successfully!"
          );
        } else {
          setuploadedMeetingId(response.id);
          setOfflinesuccessMessage(
            meeting
              ? "Meeting updated successfully!"
              : "Please add the Meeting invitees!"
          );
        }
      } else {
        alert("Failed to save meeting. Please try again.");
      }
    } catch (error) {
      console.error("Error saving meeting:", error);
      alert("An error occurred while saving the meeting.");
    }
  };
  const handleConfirm = () => {
    navigate("/events/pre-event-planning/meeting-list");
  };
  const handleOfflinesuccessMessageConfirm = () => {
    setViewUploadInviteeInfo(true);
    setOfflineinputBox(true);
    // navigate("/events/pre-event-planning/meeting-list");
  };
  const [selectedOption, setSelectedOption] = useState();

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === "create") {
      navigate("/events/pre-event-planning/add-meetings");
    } else if (e.target.value === "summary") {
      navigate("/events/pre-event-planning/upload-meeting-summary");
    }
  };
  const handleGoBack = () => {
    navigate("/events/pre-event-planning/meeting-list");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="White_Box">
            <EventName />
            <div className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-top">
                    Go back to the meeting overview
                  </Tooltip>
                }
              >
                <button
                  className="btn"
                  onClick={handleGoBack}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    fontSize: "14px",
                    color: "#fff",
                    backgroundColor: "#007272",
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{ marginRight: "5px", fontSize: "14px" }}
                  />
                </button>
              </OverlayTrigger>
            </div>
            <>
              <div className="row">
                <div className="col-md-12 text-center mb-3">
                  <div className="form-check-inline">
                    <label className="form-check-label" htmlFor="radio1">
                      <input
                        type="radio"
                        name="meetingOption"
                        className="form-check-input"
                        value="create"
                        checked
                        onChange={handleOptionChange}
                      />
                      Create Individual Meetings and Send invite to Organizers
                    </label>
                  </div>
                  <div className="form-check-inline">
                    <label className="form-check-label" htmlFor="radio2">
                      <input
                        type="radio"
                        name="meetingOption"
                        className="form-check-input"
                        value="summary"
                        checked={selectedOption === "summary"}
                        onChange={handleOptionChange}
                      />
                      Fill Summary for Meetings
                    </label>
                  </div>
                </div>
              </div>
            </>


            {!meeting ? (
                    <div className="row mb-3 justify-content-center">
                    <div className="col-md-3 text-center">
                      <div className="form-group">
                        <label>Type of Meeting</label>
                        <select
                          className="form-control"
                          onChange={handleMeetingTypeChange}
                          value={meetingData.meetingtype}
                        >
                          <option value="offline">Offline</option>
                          <option value="online">Online</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  ) : null}
            
          </div>
          {datevalidation && (
            <div
              className="alert alert-danger d-flex align-items-center"
              role="alert"
            >
              <div>{datevalidation}</div>
            </div>
          )}

          {successMessage && (
            <CustomAlert
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
              onConfirm={handleConfirm}
            />
          )}
          {OfflinesuccessMessage && (
            <CustomAlert
              message={OfflinesuccessMessage}
              onClose={() => setOfflinesuccessMessage(null)}
              onConfirm={handleOfflinesuccessMessageConfirm}
            />
          )}

          <form onSubmit={handleSubmit}>
            {meetingType === "online" && (
              <div className="row">
                <div className="col-md-12">
                  <div className="OnlineMeetingWrp mb-3">
                    <div className="row">
                      <div className="col-md-12">
                        <h3 className="rowTitle">Online Meeting</h3>
                        <hr />
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input
                            required
                            type="text"
                            name="name"
                            value={meetingData.name}
                            onChange={handleChange}
                            className="form-control"
                            id="name"
                          />
                          {nameError && (
                            <small className="text-danger">{nameError}</small>
                          )}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="meetingStartDate">
                            Date of the Meeting
                          </label>
                          <input
                            required
                            type="date"
                            name="meetingStartDate"
                            value={meetingData.meetingStartDate}
                            onChange={handleChange}
                            className="form-control"
                            id="meetingStartDate"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="duration">Duration</label>
                          <select
                            required
                            name="duration"
                            value={meetingData.duration}
                            onChange={handleChange}
                            className="form-control"
                            id="duration"
                          >
                            <option value="15">15 mins</option>
                            <option value="30">30 mins</option>
                            <option value="45">45 mins</option>
                            <option value="60">1 hr</option>
                            <option value="90">1.5 hrs</option>
                            <option value="120">2 hrs</option>
                            <option value="150">2.5 hrs</option>
                            <option value="180">3 hrs</option>
                            <option value="210">3.5 hrs</option>
                            <option value="240">4 hrs</option>
                            <option value="270">4.5 hrs</option>
                            <option value="300">5 hrs</option>
                            <option value="330">5.5 hrs</option>
                            <option value="360">6 hrs</option>

                          </select>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="organizerCount">
                            Number of organizers attending
                          </label>
                          <input
                            required
                            type="number"
                            name="organizerCount"
                            value={meetingData.organizerCount}
                            onChange={handleChange}
                            className="form-control"
                            id="organizerCount"
                            min={1}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 text-center">
                        <button className="btn GreenBtn">
                          {meeting ? "Update" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {meetingType === "offline" && (
              <div className="row">
                <div className="col-md-12">
                  <div className="OfflineMeetingWrp">
                    <div className="row">
                      <div className="col-md-12">
                        <h3 className="rowTitle">Offline Meeting</h3>
                        <hr />
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input
                            required
                            type="text"
                            name="name"
                            value={meetingData.name}
                            onChange={handleChange}
                            className="form-control"
                            id="name"
                            disabled={OfflineinputBox}
                          />
                          {nameError && (
                            <small className="text-danger">{nameError}</small>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label htmlFor="meetingStartDate">
                            Date of the Meeting
                          </label>
                          <input
                            required
                            type="date"
                            name="meetingStartDate"
                            value={meetingData.meetingStartDate}
                            onChange={handleChange}
                            className="form-control"
                            id="meetingStartDate"
                            disabled={OfflineinputBox}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="location">
                            Location of the Meeting
                          </label>
                          <input
                            ref={locationInputRef}
                            type="text"
                            className="form-control"
                            name="locationAddress"
                            value={locationValue}
                            onChange={(e) => setLocationValue(e.target.value)}
                            placeholder="Enter location"
                            required
                            disabled={OfflineinputBox}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="mealType">Meals Provided</label>
                        <div className="form-group">
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                name="Breakfast"
                                id="Breakfast"
                                checked={meetingData.mealType.Breakfast}
                                onChange={handleMealChange}
                                disabled={OfflineinputBox}
                              />
                              Breakfast
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                name="Lunch"
                                id="Lunch"
                                checked={meetingData.mealType.Lunch}
                                onChange={handleMealChange}
                                disabled={OfflineinputBox}
                              />
                              Lunch
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                name="HighTea"
                                id="HighTea"
                                checked={meetingData.mealType.HighTea}
                                onChange={handleMealChange}
                                disabled={OfflineinputBox}
                              />
                              High-Tea
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                name="Dinner"
                                id="Dinner"
                                checked={meetingData.mealType.Dinner}
                                onChange={handleMealChange}
                                disabled={OfflineinputBox}
                              />
                              Dinner
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div>
                          <button
                            type="submit"
                            className="btn GreenBtn"
                            disabled={OfflineinputBox}
                          >
                            {meeting ? "Update" : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
          {meetingType === "offline" && (ViewUploadInviteeInfo || meeting) && (
            <div className="OfflineMeetingWrp">
              <div className="row">
                <div className="col-md-12">
                  <div className="buttons">
                    <p>
                      Upload the list of organizers using the{" "}
                      <a href="https://api.ecoindex.ai/download/MeetingInvite/MeetingInvite.xlsx">
                        file format
                      </a>{" "}
                    </p>
                    <UploadSpreadsheetButton
                      uploadtype="meetinginvite"
                      onUploadSuccess={handleUploadSuccess}
                      fileName={selectedFileName}
                    />
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

export default AddMeeting;
