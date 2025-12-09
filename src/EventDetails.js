import React, { useState, useRef, useEffect } from "react";
import "./EventDetailsPage.css";
import EcoIndex from "./EcoIndex";
import EventDetailsSidebar from "./eventDetailsSidebar";
import { useEvent } from "./EventDetailsContext";
import { updateEventDetails } from "./apiService";
import CustomAlert from "./CustomAlert"; 
import { useNavigate } from "react-router-dom";
import "./assets/styles/font-awesome.css";
import AttendeeDetaileventDetailsSidebar from "./AttendeeDetaileventDetailsSidebar";
import OrganiserDetailsSidebar from "./OragniserDetailsSidebar";

const EventDetails = ({ eventId }) => {
  const navigate = useNavigate();

  const { eventDetails, setEventDetails } = useEvent();
  const [isWasteDisposalChecked, setIsWasteDisposalChecked] = useState(false);

  const [formData, setFormData] = useState({
    name: { id: "", value: "" },
    type: { id: "", value: "Conference" },
    startDate: { id: "", value: "" },
    endDate: { id: "", value: "" },
    participantCount: { id: "", value: "" },
    roomsBooked: { id: "", value: "" },
    mealProvided: false,
    area: { id: "", value: "" },
    areaUnit: { id: "", value: "Sqft" },
    mealsServed: {
      id: "",
      value: {
        veg: false,
        nonVeg: false,
        vegan: false,
        alcohol: false,
      },
    },
    mealsServedPerDay: { id: "", value: "" },
    isShuttleService: false,
    locationAddress: { id: "", value: "" },
    waterProvision: {
      PackagedBottle: false,
      Filledonsite: false,
    },
    emissionBoundary: {
      materialConsumption: false,
      organicWasteConverter: false,
      wasteDisposal: {
        value: false,
        subitem: {
          Recycler: false,
          Landfill: false,
        },
      },
    },
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");

  const locationRef = useRef(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datevalidation, setDateValidation] = useState(null);
  const [locationexist, setLocationExist]=useState(true);

  const parseEmissionBoundary = (boundaryString) => {
    const boundaryParts = boundaryString?.split(", ");
    const boundaryObj = {
      materialConsumption: boundaryParts?.includes("Material Consumption"),
      organicWasteConverter: boundaryParts?.includes("Organic Waste Converter"),
      wasteDisposal: {
        value: boundaryParts?.some((part) => part.startsWith("WasteDisposal")),
        subitem: {
          Recycler: boundaryString?.includes("Recycler"),
          Landfill: boundaryString?.includes("Landfill"),
        },
      },
    };
    return boundaryObj;
  };
  const parseMealType = (mealType) => {
    if (!mealType) return [];
    return mealType.split("|").map((item) => item.trim().toLowerCase());
  };

  useEffect(() => {
    if (eventDetails) {
      const mealArray = parseMealType(eventDetails.mealType);

      setFormData((prevFormData) => ({
        ...prevFormData,
        name: {
          id: eventDetails.eventId || "",
          value: eventDetails.eventName || "",
        },
        type: {
          id: eventDetails.eventId || "",
          value: eventDetails.eventType || "",
        },
        startDate: {
          id: eventDetails.eventId || "",
          value: eventDetails.startDate || "",
        },
        endDate: {
          id: eventDetails.eventId || "",
          value: eventDetails.endDate || "",
        },
        participantCount: {
          id: eventDetails.eventId || "",
          value: eventDetails.participantCount || "",
        },
        roomsBooked: {
          id: eventDetails.eventId || "",
          value: eventDetails.roomsBooked || "",
        },
        mealProvided:
          eventDetails.mealProvided !== undefined
            ? eventDetails.mealProvided
            : false,

        isShuttleService:
          eventDetails.isShuttleService !== undefined
            ? eventDetails.isShuttleService
            : false,

        area: {
          id: eventDetails.eventId || "",
          value: eventDetails.area || "",
        },
        areaUnit: {
          id: eventDetails.eventId || "",
          value: eventDetails.areaUnit || "Sqft",
        },
        mealsServedPerDay: {
          id: eventDetails.eventId || "",
          value: eventDetails.mealCount || "",
        },
        mealsServed: {
          id: eventDetails.eventId || "",
          value: {
            veg: mealArray.includes("veg"),
            nonVeg: mealArray.includes("nonveg"),
            vegan: mealArray.includes("vegan"),
            alcohol: mealArray.includes("alcohol"),
          },
        },
        locationAddress: {
          id: eventDetails.eventId || "",
          value: eventDetails.location || "",
        },
        waterProvision: {
          PackagedBottle: eventDetails.waterProvision === "PackagedBottle",
          Filledonsite: eventDetails.waterProvision === "FilledOnSite",
        },
        emissionBoundary: parseEmissionBoundary(eventDetails.boundary),
      }));

      setLocation(eventDetails.location);
      setIsWasteDisposalChecked(
        eventDetails.boundary?.includes("WasteDisposal") || false
      );
      setLoading(false);
    }
  }, [eventDetails]);
  // console.log("meal provided : ",eventDetails.mealProvided);
  // console.log("isShuttleServices: ",eventDetails.isShuttleService);
  const handleWasteDisposalChange = () => {
    const newCheckedState = !isWasteDisposalChecked;

    setIsWasteDisposalChecked(newCheckedState);

    setFormData((prevData) => ({
      ...prevData,
      emissionBoundary: {
        ...prevData.emissionBoundary,
        wasteDisposal: {
          ...prevData.emissionBoundary.wasteDisposal,
          value: newCheckedState,
        },
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [field, subField] = name?.split(".");

    if (type === "checkbox") {
      if (field === "waterProvision") {
        setFormData((prevData) => ({
          ...prevData,
          waterProvision: {
            ...prevData.waterProvision,
            [subField]: checked,
          },
        }));
      } else if (field === "emissionBoundary") {
        setFormData((prevData) => ({
          ...prevData,
          emissionBoundary: {
            ...prevData.emissionBoundary,
            [subField]: checked,
          },
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          mealsServed: {
            ...prevData.mealsServed,
            value: {
              ...prevData.mealsServed.value,
              [subField]: checked,
            },
          },
        }));
      }
    } else if (type === "radio" && field === "waterProvision") {
      setFormData((prevData) => ({
        ...prevData,
        waterProvision: { ...prevData.waterProvision, value: value },
      }));
    } else if (name === "startDate") {
      // Update startDate and set endDate to the same value
      setFormData((prevData) => ({
        ...prevData,
        startDate: { id: prevData.startDate.id, value: value },
        endDate: { id: prevData.endDate.id, value: value }, // Set endDate to startDate
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [field]: { id: prevData[field]?.id || "", value: value },
      }));
    }
  };

  const handleWasteDisposalSubitemChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      emissionBoundary: {
        ...prevData.emissionBoundary,
        wasteDisposal: {
          ...prevData.emissionBoundary.wasteDisposal,
          subitem: {
            ...prevData.emissionBoundary.wasteDisposal.subitem,
            [name]: checked,
          },
        },
      },
    }));
  };

  useEffect(() => {
    const initializeAutocomplete = () => {
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
          setDateValidation("Please select a valid location before saving");
          setLocationExist(false);
          return;
        }
        setLocationExist(true);
        setDateValidation(null);
        setLocation(place.formatted_address);
        setFormData((prevFormData) => ({
          ...prevFormData,
          locationAddress: {
            id: prevFormData.locationAddress.id,
            value: place.formatted_address,
          },
        }));
      });
    };

    if (window.google && window.google.maps) {
      initializeAutocomplete();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCpdevcXjKt9CVD1n8chB59MGW0d1uT2dg&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    }
  }, []);
  console.log("EventDetails from eventTable:", eventDetails);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const UnitConversion = (value, unit) => {
    let convertedValue;
    if (unit === "Sqft") {
      convertedValue = parseFloat(value);
    } else if (unit === "Sqm") {
      convertedValue = parseFloat(value) / 0.092903;
    } else {
      convertedValue = parseFloat(value);
    }
    return parseFloat(convertedValue.toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDate = new Date(formData.startDate.value);
    const endDate = new Date(formData.endDate.value);

    if (endDate < startDate) {
      setDateValidation("End date must be on or after start date.");
      return;
    }
    if (!locationexist) { 
      return; 
    }

    // Validation for at least one meal type
    if (
      !formData.mealsServed.value.veg &&
      !formData.mealsServed.value.nonVeg &&
      !formData.mealsServed.value.vegan &&
      !formData.mealsServed.value.alcohol
    ) {
      setDateValidation("Please select at least one meal type.");
      return;
    }

    const emissionBoundaryArray = [];
    if (formData.emissionBoundary.materialConsumption)
      emissionBoundaryArray.push("Material Consumption");
    if (formData.emissionBoundary.organicWasteConverter)
      emissionBoundaryArray.push("Organic Waste Converter");
    if (formData.emissionBoundary.wasteDisposal.value) {
      const wasteDisposalSubitems = Object.entries(
        formData.emissionBoundary.wasteDisposal.subitem
      )
        .filter(([key, value]) => value)
        .map(([key]) => key)
        .join(", ");
      emissionBoundaryArray.push(`WasteDisposal:{${wasteDisposalSubitems}}`);
    }

    const boundarypost = emissionBoundaryArray.join(", ");

    const updatedEventData = {
      eventId: eventDetails.eventId,
      eventName: formData.name.value,
      eventType: formData.type.value,
      createdOn: eventDetails.createdOn,
      createdBy: eventDetails.createdBy,
      participantCount: formData.participantCount.value,
      roomsBooked: formData.roomsBooked.value,
      mealProvided: formData.mealProvided,
      isShuttleService: formData.isShuttleService,
      area: UnitConversion(formData.area.value, formData.areaUnit.value),
      boundary: boundarypost,
      startDate: formData.startDate.value,
      endDate: formData.endDate.value,
      location: formData.locationAddress.value,
      waterProvision: formData.waterProvision.PackagedBottle
        ? "PackagedBottle"
        : "FilledOnSite",
      mealType: [
        formData.mealsServed.value.veg ? "Veg" : null,
        formData.mealsServed.value.nonVeg ? "NonVeg" : null,
        formData.mealsServed.value.vegan ? "Vegan" : null,
        formData.mealsServed.value.alcohol ? "Alcohol" : null,
      ]
        .filter(Boolean)
        .join("|"),
      mealCount: Number(formData.mealsServedPerDay.value),
    };

    try {
      console.log("updated", updatedEventData);
      const response = await updateEventDetails(updatedEventData);
      console.log("Response Data:", response);
      setAlertMessage("Data saved successfully");
      setAlertType("success");
      setShowAlert(true);
      setEventDetails(updatedEventData);
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage(
        "Error saving data. Please check your inputs and try again."
      );
      setAlertType("error");
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === "success") {
      navigate("/events/pre-event-planning/pre-planning");
    }
  };
  const isAttendee = eventDetails?.myRole === "Attendee";
  const isOrganizer = eventDetails?.myRole === "Organizer";

  return (
    <>
      <div className="new-event-page">
        <EcoIndex />
        <div className="main-content">
          {eventDetails.myRole === "Attendee" ? (
            <AttendeeDetaileventDetailsSidebar eventDetails={eventDetails} />
          ) : eventDetails.myRole === "Organizer" ? (
            <OrganiserDetailsSidebar eventDetails={eventDetails} />
          ) : (
            <EventDetailsSidebar eventDetails={eventDetails} />
          )}
          {/* <EventDetailsSidebar eventDetails={formData} /> */}

          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="White_Box">
                  <form className="firstform">
                    <div className="row">
                      <div className="col-md-12">
                        <h3>Event Details</h3>
                        {datevalidation && (
                          <div
                            className="alert alert-danger d-flex align-items-center"
                            role="alert"
                          >
                            <div>{datevalidation}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="name">Event Name</label>
                          <input
                            disabled={isAttendee || isOrganizer}
                            required
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name.value}
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="type">Type of Event</label>
                          <select
                            disabled={isAttendee || isOrganizer}
                            id="type"
                            name="type"
                            value={formData.type.value}
                            className="form-control"
                            onChange={handleChange}
                          >
                            <option value="conference">Conference</option>
                            <option value="exhibition">Exhibition</option>
                            <option value="festival">Festival</option>
                            <option value="mega-events">Mega Events</option>
                            <option value="special-occasion">
                              Special Occasion
                            </option>
                            <option value="others">Others</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="startDate">Start Date</label>
                          <input
                            disabled={isAttendee || isOrganizer}
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate.value}
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="endDate">End Date</label>
                          <input
                            disabled={isAttendee || isOrganizer}
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate.value}
                            min={formData.startDate.value}
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="participantCount">
                            {" "}
                            Total Attendees{" "}
                          </label>
                          <input
                            disabled={isAttendee || isOrganizer}
                            type="number"
                            id="participantCount"
                            name="participantCount"
                            value={formData.participantCount.value}
                            className="form-control"
                            onChange={handleChange}
                            min={0}
                            max={9999999999}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="roomsBooked">
                            {""}Number of hotels Rooms booked{""}
                          </label>
                          <input
                            disabled={isAttendee || isOrganizer}
                            type="number"
                            id="roomsBooked"
                            name="roomsBooked"
                            value={formData.roomsBooked.value}
                            className="form-control"
                            onChange={handleChange}
                            min={0}
                            max={9999999999}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <div className="form-group">
                            <label htmlFor="locationAddress">
                              Location of Event
                            </label>
                            <input
                              disabled={isAttendee || isOrganizer}
                              required
                              type="text"
                              id="locationAddress"
                              name="locationAddress"
                              value={formData.locationAddress.value}
                              ref={locationRef}
                              className="form-control"
                              onChange={(e) => {
                                setLocation(e.target.value);
                                setFormData((prevData) => ({
                                  ...prevData,
                                  locationAddress: {
                                    ...prevData.locationAddress,
                                    value: e.target.value,
                                  },
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <h3>
                          Emission Boundary
                          <span className="tooltip-icon">
                            <i
                              className="fa fa-info-circle"
                              aria-hidden="true"
                            />
                            <span className="tooltip-text">
                              The Emission Boundary limits the tracking scope
                              for an event. Select the headers for which you
                              wish to track the carbon emissions
                            </span>
                          </span>
                        </h3>
                        <hr></hr>
                      </div>
                    </div>
                    <div class="row">
                      <div className="col-md-3">
                        <label>Are you providing meals to?</label>
                        <select
                          className="form-control"
                          name="mealProvided"
                          value={String(formData.mealProvided)} // Ensure it's a string for dropdown
                          onChange={(e) => {
                            //console.log("Dropdown value selected:", e.target.value); // Debugging line
                            setFormData((prevData) => ({
                              ...prevData,
                              mealProvided: e.target.value === "true", // Converts string "true"/"false" to boolean
                            }));
                          }}
                          disabled={isAttendee || isOrganizer} // Disable based on these values
                        >
                          <option value="true">All Attendees</option>
                          <option value="false">
                            Only Delegates and VVIPs
                          </option>
                        </select>
                      </div>

                      <div class="col-md-3">
                        <div class="formdata">
                          <label>
                            Are you providing Shuttle for Local travel?
                          </label>
                          <select
                            className="form-control"
                            name="isShuttleService"
                            value={String(formData.isShuttleService)} // Ensure it's a string for dropdown
                            onChange={(e) => {
                              //console.log("Dropdown value selected:", e.target.value); // Debugging line
                              setFormData((prevData) => ({
                                ...prevData,
                                isShuttleService: e.target.value === "true", // Converts string "true"/"false" to boolean
                              }));
                            }}
                            disabled={isAttendee || isOrganizer} // Disable based on these values
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Meals Served</label>
                          <div className="checkbox-group">
                            <label>
                              <input
                                disabled={isAttendee || isOrganizer}
                                type="checkbox"
                                class="form-check-input"
                                name="mealsServed.veg"
                                checked={formData.mealsServed.value.veg}
                                onChange={handleChange}
                              />
                              Veg
                            </label>
                            <label>
                              <input
                                disabled={isAttendee || isOrganizer}
                                type="checkbox"
                                class="form-check-input"
                                name="mealsServed.nonVeg"
                                checked={formData.mealsServed.value.nonVeg}
                                onChange={handleChange}
                              />
                              Non-Veg
                            </label>
                            <label>
                              <input
                                disabled={isAttendee || isOrganizer}
                                type="checkbox"
                                class="form-check-input"
                                name="mealsServed.vegan"
                                checked={formData.mealsServed.value.vegan}
                                onChange={handleChange}
                              />
                              Vegan
                            </label>
                            <label>
                              <input
                                disabled={isAttendee || isOrganizer}
                                type="checkbox"
                                class="form-check-input"
                                name="mealsServed.alcohol"
                                checked={formData.mealsServed.value.alcohol}
                                onChange={handleChange}
                              />
                              Alcohol
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Tick the checkbox to track emissions</label>
                          <div className="checkbox-group">
                            <label>
                              <input
                                disabled={isAttendee || isOrganizer}
                                type="checkbox"
                                class="form-check-input"
                                name="emissionBoundary.materialConsumption"
                                checked={
                                  formData.emissionBoundary.materialConsumption
                                }
                                onChange={handleChange}
                              />
                              Material Consumption
                            </label>
                            <label>
                              <input
                                disabled={isAttendee || isOrganizer}
                                type="checkbox"
                                class="form-check-input"
                                name="emissionBoundary.organicWasteConverter"
                                checked={
                                  formData.emissionBoundary
                                    .organicWasteConverter
                                }
                                onChange={handleChange}
                              />
                              Organic Waste converter on-site
                              <span className="tooltip-icon">
                                <i
                                  className="fa fa-info-circle"
                                  aria-hidden="true"
                                />
                                <span className="tooltip-text">
                                  Are you using Organic Waste Converters
                                  On-Site?
                                </span>
                              </span>
                            </label>
                            <label>
                              <input
                                disabled={isAttendee || isOrganizer}
                                type="checkbox"
                                class="form-check-input"
                                name="emissionBoundary.wasteDisposal.value"
                                checked={isWasteDisposalChecked}
                                onChange={handleWasteDisposalChange}
                              />
                              Waste Disposal
                              <span className="tooltip-icon">
                                <i
                                  className="fa fa-info-circle"
                                  aria-hidden="true"
                                />
                                <span className="tooltip-text">
                                  Would you like to track paper, plastic, and
                                  organic waste generated during the event?
                                  Standard default values will be provided.
                                </span>
                              </span>
                            </label>
                            {isWasteDisposalChecked && (
                              <div className="sub-checkbox-group">
                                <label>
                                  <input
                                    disabled={isAttendee || isOrganizer}
                                    type="checkbox"
                                    class="form-check-input"
                                    name="Recycler"
                                    checked={
                                      formData.emissionBoundary.wasteDisposal
                                        .subitem.Recycler
                                    }
                                    onChange={handleWasteDisposalSubitemChange}
                                  />
                                  Recycler
                                </label>
                                <label>
                                  <input
                                    disabled={isAttendee || isOrganizer}
                                    type="checkbox"
                                    class="form-check-input"
                                    name="Landfill"
                                    checked={
                                      formData.emissionBoundary.wasteDisposal
                                        .subitem.Landfill
                                    }
                                    onChange={handleWasteDisposalSubitemChange}
                                  />
                                  Landfill
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Water Provision</label>
                          <div className="radio-group">
                            <label>
                              <input
                                disabled={isAttendee || isOrganizer}
                                type="radio"
                                class="form-check-input"
                                name="waterProvision"
                                value="PackagedBottle"
                                checked={formData.waterProvision.PackagedBottle}
                                onChange={() =>
                                  setFormData((prevData) => ({
                                    ...prevData,
                                    waterProvision: {
                                      PackagedBottle: true,
                                      Filledonsite: false,
                                    },
                                  }))
                                }
                              />
                              Packaged Bottle
                            </label>
                            <label>
                              <input
                                disabled={isAttendee || isOrganizer}
                                type="radio"
                                class="form-check-input"
                                name="waterProvision"
                                value="Filledonsite"
                                checked={formData.waterProvision.Filledonsite}
                                onChange={() =>
                                  setFormData((prevData) => ({
                                    ...prevData,
                                    waterProvision: {
                                      PackagedBottle: false,
                                      Filledonsite: true,
                                    },
                                  }))
                                }
                              />
                              Filled on-site
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {" "}
                      <div className="col-md-12 text-right">
                        <button
                          // type="submit"
                          className="btn save-button"
                          disabled={isAttendee || isOrganizer}
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
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
          />
        )}
      </div>
    </>
  );
};

export default EventDetails;
