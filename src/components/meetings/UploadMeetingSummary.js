import "./UploadMeetingSummary.css";
import "./AddMeeting.css";
import React, { useState, useEffect } from "react";
import { updateMeetingsSummary } from "../../apiService";
import EventName from "../../EventName";
import { useEvent } from "../../EventDetailsContext";
import CustomAlert from "../../CustomAlert";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { getMeetingSummary } from "../../apiService";

const UploadMeetingSummary = () => {
  const { eventDetails } = useEvent();
  const [validation, setValidation] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [meetingLocked, setMeetingLocked] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    onlineMeetings: {
      meetingCount: 0,
      duration: 0,
      organizerCount: 0,
    },
    offlineMeetings: {
      meetingCount: 0,
      travelEntries: [],
      accommodation: {
        NA: 0,
        Star3: 0,
        Star4: 0,
        Star5: 0,
      },
      meals: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        highTea: 0,
      },
    },
  });

  const travelModes = [
    { travelModeId: 1, mode: "Car", type: "Diesel", category: "Individual" },
    { travelModeId: 2, mode: "Car", type: "Petrol", category: "Individual" },
    { travelModeId: 3, mode: "Car", type: "CNG", category: "Individual" },
    { travelModeId: 4, mode: "Car", type: "Electric", category: "Individual" },
    {
      travelModeId: 5,
      mode: "Bus",
      type: "Fuel-Based",
      category: "Individual",
    },
    { travelModeId: 6, mode: "Train", type: "Train", category: "Individual" },
    { travelModeId: 7, mode: "Bus", type: "Electric", category: "Individual" },
    {
      travelModeId: 8,
      mode: "Flight",
      type: "Economy",
      category: "Individual",
    },
    {
      travelModeId: 13,
      mode: "Flight",
      type: "Business",
      category: "Individual",
    },
  ];
  const convertToHours = (duration) => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours + minutes / 60 + seconds / 3600;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!eventDetails) {
          throw new Error("Event details not available");
        }

        const eventId = eventDetails.eventId;
        const data = await getMeetingSummary(eventId);
        setMeetingLocked(data.isMeetinglocked);

        const fetchedTravelEntries =
          data.offlineMeetingSummary.attendeeMeetingTravelConsumptions.length >
          0
            ? data.offlineMeetingSummary.attendeeMeetingTravelConsumptions.map(
                (entry) => ({
                  Travel:
                    travelModes.find(
                      (mode) => mode.travelModeId === entry.travelModeId
                    )?.mode || "",
                  Transportation:
                    travelModes.find(
                      (mode) => mode.travelModeId === entry.travelModeId
                    )?.type || "",
                  NumberOfPeople: entry.attendeeCount,
                  AverageDistance: entry.avgDistance,
                })
              )
            : [
                {
                  Travel: "",
                  Transportation: "",
                  NumberOfPeople: 0,
                  AverageDistance: 0,
                },
              ];

        setFormData((prevFormData) => ({
          ...prevFormData,
          onlineMeetings: {
            meetingCount: data.onlineMeetingSummary.totalMeetingCount,
            duration: convertToHours(data.onlineMeetingSummary.totalDuration),
            organizerCount: data.onlineMeetingSummary.averageNoOfOrganizers,
          },
          offlineMeetings: {
            meetingCount: data.offlineMeetingSummary.totalMeetingCount,
            travelEntries: fetchedTravelEntries,
            accommodation: {
              Star3:
                data.offlineMeetingSummary.attendeeMeetingAccommodationConsumptions.find(
                  (acc) => acc.accommodationId === 1
                )?.attendeeCount || 0,
              Star4:
                data.offlineMeetingSummary.attendeeMeetingAccommodationConsumptions.find(
                  (acc) => acc.accommodationId === 2
                )?.attendeeCount || 0,
              Star5:
                data.offlineMeetingSummary.attendeeMeetingAccommodationConsumptions.find(
                  (acc) => acc.accommodationId === 3
                )?.attendeeCount || 0,
              NA:
                data.offlineMeetingSummary.attendeeMeetingAccommodationConsumptions.find(
                  (acc) => acc.accommodationId === 4
                )?.attendeeCount || 0,
            },
            meals: {
              breakfast:
                data.offlineMeetingSummary.attendeeMeetingMeals.breakfast,
              lunch: data.offlineMeetingSummary.attendeeMeetingMeals.lunch,
              dinner: data.offlineMeetingSummary.attendeeMeetingMeals.dinner,
              highTea: data.offlineMeetingSummary.attendeeMeetingMeals.highTea,
            },
          },
        }));

        setTravelEntries(fetchedTravelEntries);
        fetchedTravelEntries.forEach((entry, index) => {
          if (entry.Travel) {
            updateTransportationOptions(entry.Travel, index);
          }
        });
        console.log("Travel", fetchedTravelEntries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [eventDetails]);

  const updateTransportationOptions = (travel, index) => {
    const options = travelModes
      .filter((mode) => mode.mode === travel)
      .map((mode) => ({
        value: mode.type,
        label: mode.type,
      }));

    setTravelEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[index].TransportationOptions = options;
      return newEntries;
    });
  };
  const [travelEntries, setTravelEntries] = useState([
    {
      Travel: "",
      Transportation: "",
      NumberOfPeople: 0,
      AverageDistance: 0,
    },
  ]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      offlineMeetings: {
        ...prevFormData.offlineMeetings,
        travelEntries: travelEntries,
      },
    }));
    console.log("traveleffectcalled");
  }, [travelEntries]);

  console.log("formtravel", formData);

  const getUniqueModes = () => {
    const uniqueModes = Array.from(
      new Set(travelModes.map((mode) => mode.mode))
    );
    return uniqueModes.map((mode) => ({
      mode,
      travelModeId: travelModes.find((m) => m.mode === mode).travelModeId,
    }));
  };
  const handleAddRow = () => {
    setTravelEntries([
      ...travelEntries,
      {
        Travel: "",
        Transportation: "",
        NumberOfPeople: 0,
        AverageDistance: 0,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newEntries = travelEntries.filter((_, i) => i !== index);
    setTravelEntries(newEntries);
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;

    setTravelEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[index] = {
        ...newEntries[index],
        [name]: value,
      };
      if (name === "Travel") {
        updateTransportationOptions(value, index);
      }
      return newEntries;
    });
  };

  const handleSectionChange = (section, subsection, name, e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [section]: {
        ...prevFormData[section],
        [subsection]: {
          ...prevFormData[section][subsection],
          [name]: value,
        },
      },
    }));
  };

  const handleOnlineChange = (section, name, e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [section]: {
        ...prevFormData[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { onlineMeetings, offlineMeetings } = formData;
    if (
      Number(onlineMeetings.meetingCount) === 0 &&
      Number(offlineMeetings.meetingCount) === 0
    ) {
      setValidation(
        "Please fill at least one of either online or offline meetings."
      );
      return;
    }

    if (Number(onlineMeetings.meetingCount) === 0) {
      if (
        Number(onlineMeetings.duration) > 0 ||
        Number(onlineMeetings.organizerCount) > 0
      ) {
        setValidation(
          "Online meeting count is 0. Please update the count to match the provided details."
        );
        return;
      }
    } else {
      if (
        Number(onlineMeetings.meetingCount) <= 0 ||
        Number(onlineMeetings.duration) <= 0 ||
        Number(onlineMeetings.organizerCount) <= 0
      ) {
        setValidation("Please fill all details for online meetings.");
        return;
      }
    }
    let TravelToSend = [];
    let accommodationEntries = [];
    if (offlineMeetings.meetingCount > 0) {
      if (offlineMeetings.travelEntries.length === 0) {
        setValidation(
          "Please provide at least one travel mode entry for offline meetings."
        );
        return;
      }

      const allTravelEntriesValid = offlineMeetings.travelEntries.every(
        (entry) =>
          entry.Travel &&
          entry.Transportation &&
          entry.NumberOfPeople > 0 &&
          entry.AverageDistance > 0
      );

      if (!allTravelEntriesValid) {
        setValidation("Please fill all details for each travel mode entry.");
        return;
      }

      const accommodationData = offlineMeetings.accommodation;

      const travel = offlineMeetings.travelEntries;
      TravelToSend = travel.map((entry) => {
        const mode = travelModes.find(
          (travelModes) =>
            travelModes.mode === entry.Travel &&
            travelModes.type === entry.Transportation
        );

        return {
          TravelMode: mode ? mode.travelModeId : null,
          AttendeeCount: Number(entry.NumberOfPeople),
          AvgDistance: Number(entry.AverageDistance),
        };
      });

      accommodationEntries = Object.keys(accommodationData).map((key) => {
        const idMap = {
          Star3: 1,
          Star4: 2,
          Star5: 3,
          NA: 4,
        };
        return {
          AccommodationId: idMap[key],
          AttendeeCount: Number(accommodationData[key]),
        };
      });
    }

    const postData = {
      EventId: eventDetails.eventId,
      OnlineMeetingCount: Number(formData.onlineMeetings.meetingCount),
      OnlineMeetingTotalDuration: Number(formData.onlineMeetings.duration) * 60,
      OnlineMeetingOrganizerCount: Number(
        formData.onlineMeetings.organizerCount
      ),
      OfflineMeetingCount: Number(formData.offlineMeetings.meetingCount),
      BreakfastCount: Number(formData.offlineMeetings.meals.breakfast),
      LunchCount: Number(formData.offlineMeetings.meals.lunch),
      DinnerCount: Number(formData.offlineMeetings.meals.dinner),
      HighTeaCount: Number(formData.offlineMeetings.meals.highTea),
      TravelEntries: TravelToSend,
      AccommodationEntries: accommodationEntries,
    };
    const tod = JSON.stringify(postData);
    console.log("postData", tod);
    try {
      const response = await updateMeetingsSummary(postData);
      if (response === "Meeting summary saved successfully.") {
        setSuccessMessage("Data submitted successfully!");
      } else {
        setSuccessMessage(`Unexpected response: ${response.data}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setSuccessMessage(
        "An error occurred while submitting the data. Please try again."
      );
    }
  };
  const handleConfirm = () => {
    navigate("/events/pre-event-planning/meeting-list");
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
  const uniqueM = getUniqueModes();
  const handleGoBack = () => {
    navigate("/events/pre-event-planning/meeting-list");
  };
  const renderTooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;
  console.log("travelEntries", travelEntries);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="White_Box">
            <div className="row">
              <div className="col-md-12">
                <EventName />
              </div>
            </div>{" "}
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
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        meetingLocked ? (
                          renderTooltip(
                            "This option is disabled because you've already filled the summary"
                          )
                        ) : (
                          <></>
                        )
                      }
                    >
                      <span>
                        <input
                          type="radio"
                          name="meetingOption"
                          className="form-check-input"
                          value="create"
                          checked={selectedOption === "create"}
                          onChange={handleOptionChange}
                          disabled={meetingLocked}
                        />
                        Create Individual Meetings and Send invite to Organizers{" "}
                      </span>
                    </OverlayTrigger>
                  </div>
                  <div className="form-check-inline">
                    <label className="form-check-label" htmlFor="radio2">
                      <input
                        type="radio"
                        name="meetingOption"
                        className="form-check-input"
                        value="summary"
                        checked
                        onChange={handleOptionChange}
                      />
                      Fill Summary for Meetings
                    </label>
                  </div>
                </div>
              </div>
            </>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-12">
                    <div className="MeetingBoxWrp mb-3">
                      <div className="row">
                        {validation && (
                          <div
                            className="alert alert-danger d-flex align-items-center"
                            role="alert"
                          >
                            <div>{validation}</div>
                          </div>
                        )}

                        {successMessage && (
                          <CustomAlert
                            message={successMessage}
                            onClose={() => setSuccessMessage(null)}
                            onConfirm={handleConfirm}
                          />
                        )}

                        <div className="col-md-12">
                          <h3 className="rowTitle">Summary</h3>
                          <hr />
                        </div>

                        <form onSubmit={handleSubmit}>
                          <div className="col-md-12 mb-3">
                            <div className="MeetingBoxWrp GreenWrp">
                              <h3 className="rowTitle">Online Meetings</h3>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label htmlFor="usr">
                                      No. of Online Meetings conducted
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="meetingCount"
                                      id="usr"
                                      value={
                                        formData.onlineMeetings.meetingCount
                                      }
                                      onChange={(e) =>
                                        handleOnlineChange(
                                          "onlineMeetings",
                                          "meetingCount",
                                          e
                                        )
                                      }
                                      min={0}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label htmlFor="usr">
                                      Total Duration of Online meetings(Hours)
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="duration"
                                      id="usr"
                                      value={formData.onlineMeetings.duration}
                                      onChange={(e) =>
                                        handleOnlineChange(
                                          "onlineMeetings",
                                          "duration",
                                          e
                                        )
                                      }
                                      min={0}
                                      step={0.01}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label htmlFor="usr">
                                      Average No. of Organizers attending the
                                      Meeting
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="usr"
                                      name="organizerCount"
                                      value={
                                        formData.onlineMeetings.organizerCount
                                      }
                                      onChange={(e) =>
                                        handleOnlineChange(
                                          "onlineMeetings",
                                          "organizerCount",
                                          e
                                        )
                                      }
                                      min={0}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="MeetingBoxWrp WhiteWrp">
                              <h3 className="rowTitle">Offline Meetings</h3>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label htmlFor="usr">
                                      No. of Offline Meetings conducted
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="meetingCount"
                                      id="usr"
                                      value={
                                        formData.offlineMeetings.meetingCount
                                      }
                                      onChange={(e) =>
                                        handleOnlineChange(
                                          "offlineMeetings",
                                          "meetingCount",
                                          e
                                        )
                                      }
                                      min={0}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="TableWrp mb-3">
                                    <h3 className="rowTitle">
                                      Travel Information
                                    </h3>
                                    <hr />
                                    <table className="table Meetingtable">
                                      <thead>
                                        <tr>
                                          <th>Mode of Transport</th>
                                          <th>Type of Transport</th>
                                          <th>Number of people</th>
                                          <th>Average Distance Travelled</th>
                                          <th>Unit</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {travelEntries.map((entry, index) => (
                                          <tr key={index}>
                                            <td>
                                              <select
                                                name="Travel"
                                                className="form-control"
                                                value={entry.Travel}
                                                onChange={(e) =>
                                                  handleChange(index, e)
                                                }
                                              >
                                                <option value="">
                                                  Select Travel Mode
                                                </option>
                                                {uniqueM.map((option, i) => (
                                                  <option
                                                    key={i}
                                                    value={option.mode}
                                                  >
                                                    {option.mode}
                                                  </option>
                                                ))}
                                              </select>
                                            </td>
                                            <td>
                                              <select
                                                name="Transportation"
                                                className="form-control"
                                                value={entry.Transportation}
                                                onChange={(e) =>
                                                  handleChange(index, e)
                                                }
                                              >
                                                <option value="">
                                                  Select Transportation
                                                </option>
                                                {entry.TransportationOptions?.map(
                                                  (option, i) => (
                                                    <option
                                                      key={i}
                                                      value={option.value}
                                                    >
                                                      {option.label}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </td>
                                            <td>
                                              <input
                                                type="number"
                                                name="NumberOfPeople"
                                                className="form-control"
                                                value={entry.NumberOfPeople}
                                                onChange={(e) =>
                                                  handleChange(index, e)
                                                }
                                              />
                                            </td>
                                            <td>
                                              <input
                                                type="number"
                                                name="AverageDistance"
                                                className="form-control"
                                                value={entry.AverageDistance}
                                                onChange={(e) =>
                                                  handleChange(index, e)
                                                }
                                                step={0.01}
                                              />
                                            </td>
                                            <td>km</td>
                                            <td>
                                              {index ===
                                                travelEntries.length - 1 && (
                                                <button
                                                  type="button"
                                                  className="PlusBtn"
                                                  onClick={handleAddRow}
                                                >
                                                  <i
                                                    className="fa fa-plus-circle"
                                                    aria-hidden="true"
                                                  ></i>
                                                </button>
                                              )}
                                              {travelEntries.length > 1 && (
                                                <button
                                                  type="button"
                                                  className="MinusBtn"
                                                  onClick={() =>
                                                    handleRemoveRow(index)
                                                  }
                                                >
                                                  <i
                                                    className="fa fa-minus-circle"
                                                    aria-hidden="true"
                                                  ></i>
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="TableWrp">
                                    <h3 className="rowTitle">
                                      Stay Information
                                    </h3>
                                    <hr />
                                    <table className="table Meetingtable">
                                      <thead>
                                        <tr>
                                          <th>Type of Hotel</th>
                                          <th>Number of people staying</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>NA</td>
                                          <td>
                                            <input
                                              type="number"
                                              name="NA"
                                              className="form-control"
                                              value={
                                                formData.offlineMeetings
                                                  .accommodation.NA
                                              }
                                              onChange={(e) =>
                                                handleSectionChange(
                                                  "offlineMeetings",
                                                  "accommodation",
                                                  "NA",
                                                  e
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>3-Star</td>
                                          <td>
                                            <input
                                              type="number"
                                              name="Star3"
                                              className="form-control"
                                              value={
                                                formData.offlineMeetings
                                                  .accommodation.Star3
                                              }
                                              onChange={(e) =>
                                                handleSectionChange(
                                                  "offlineMeetings",
                                                  "accommodation",
                                                  "Star3",
                                                  e
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>4-Star</td>
                                          <td>
                                            <input
                                              type="number"
                                              name="Star4"
                                              className="form-control"
                                              value={
                                                formData.offlineMeetings
                                                  .accommodation.Star4
                                              }
                                              onChange={(e) =>
                                                handleSectionChange(
                                                  "offlineMeetings",
                                                  "accommodation",
                                                  "Star4",
                                                  e
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>5-Star</td>
                                          <td>
                                            <input
                                              type="number"
                                              name="Star5"
                                              className="form-control"
                                              value={
                                                formData.offlineMeetings
                                                  .accommodation.Star5
                                              }
                                              onChange={(e) =>
                                                handleSectionChange(
                                                  "offlineMeetings",
                                                  "accommodation",
                                                  "Star5",
                                                  e
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="TableWrp">
                                    <h3 className="rowTitle">Meals</h3>
                                    <hr />
                                    <table className="table Meetingtable">
                                      <thead>
                                        <tr>
                                          <th>Provided in the Meetings</th>
                                          <th>Total number served</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>Breakfast</td>
                                          <td>
                                            <input
                                              type="number"
                                              name="breakfast"
                                              className="form-control"
                                              value={
                                                formData.offlineMeetings.meals
                                                  .breakfast
                                              }
                                              onChange={(e) =>
                                                handleSectionChange(
                                                  "offlineMeetings",
                                                  "meals",
                                                  "breakfast",
                                                  e
                                                )
                                              }
                                              min={0}
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Dinner</td>
                                          <td>
                                            <input
                                              type="number"
                                              name="dinner"
                                              className="form-control"
                                              value={
                                                formData.offlineMeetings.meals
                                                  .dinner
                                              }
                                              onChange={(e) =>
                                                handleSectionChange(
                                                  "offlineMeetings",
                                                  "meals",
                                                  "dinner",
                                                  e
                                                )
                                              }
                                              min={0}
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>HighTea</td>
                                          <td>
                                            <input
                                              type="number"
                                              name="highTea"
                                              className="form-control"
                                              value={
                                                formData.offlineMeetings.meals
                                                  .highTea
                                              }
                                              onChange={(e) =>
                                                handleSectionChange(
                                                  "offlineMeetings",
                                                  "meals",
                                                  "highTea",
                                                  e
                                                )
                                              }
                                              min={0}
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Lunch</td>
                                          <td>
                                            <input
                                              type="number"
                                              name="lunch"
                                              className="form-control"
                                              value={
                                                formData.offlineMeetings.meals
                                                  .lunch
                                              }
                                              onChange={(e) =>
                                                handleSectionChange(
                                                  "offlineMeetings",
                                                  "meals",
                                                  "lunch",
                                                  e
                                                )
                                              }
                                              min={0}
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  <button
                                    type="submit"
                                    className="btn GreenBtn"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMeetingSummary;
