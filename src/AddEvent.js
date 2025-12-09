import React, { useState, useRef, useEffect } from "react";
import "./AddEvent.css";
import EcoIndex from "./EcoIndex";
import MyEventsNavbar from "./MyEventsNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { postEventData, useApi } from "./apiService";
import { useNavigate } from "react-router-dom";
import CustomAlert from "./CustomAlert";
import "./assets/styles/font-awesome.css";
import AddEventNavbar from "./AddEventNavbar";
const NewForm = () => {
  const [isWasteDisposalChecked, setIsWasteDisposalChecked] = useState(false);
  const api = useApi();
  const navigate = useNavigate();
  const handleWasteDisposalChange = () => {
    setIsWasteDisposalChecked(!isWasteDisposalChecked);
  };

  const [formData, setFormData] = useState({
    name: "",
    type: "Conference",
    startDate: "",
    endDate: "",
    participantCount: "",
    //area: "",
    //areaUnit: "Sqft",
    mealsServed: {
      veg: true,
      nonVeg: false,
      vegan: false,
      alcohol: false,
    },
    mealsServedPerDay: 1,
    locationAddress: "",
    waterProvision: "PackagedBottle",
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
    
    mealProvided: true,
    isShuttleService: true,
    roomsBooked: "",
  });
  const locationRef = useRef(null);
  const [location, setLocation] = useState("");
  const [locationexist, setLocationExist]=useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "wasteDisposal") {
        setFormData((prevData) => ({
          ...prevData,
          emissionBoundary: {
            ...prevData.emissionBoundary,
            wasteDisposal: {
              ...prevData.emissionBoundary.wasteDisposal,
              value: checked,
            },
          },
        }));
        handleWasteDisposalChange();
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: checked,
        }));
      }
    } else if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        waterProvision: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    // Ensure end date is not earlier than start date
  if (name === "startDate") {
    setFormData((prevData) => ({
      ...prevData,
      endDate: prevData.endDate < value ? value : prevData.endDate,
    }));
  }
  };

  const handleMealChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      mealsServed: {
        ...prevData.mealsServed,
        [name]: checked,
      },
    }));
  };

  const handleEmissionChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      emissionBoundary: {
        ...prevData.emissionBoundary,
        [name]: checked,
      },
    }));
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
  const [datevalidation, setDateValidation] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  

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
        console.log("Selected place:", place.formatted_address);
        setFormData((prevFormData) => ({
          ...prevFormData,
          locationAddress: place.formatted_address,
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
  const handleSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate < startDate) {
      setDateValidation("End date must be on or after start date.");
      return;
    }

    if (
      !formData.mealsServed.veg &&
      !formData.mealsServed.nonVeg &&
      !formData.mealsServed.vegan &&
      !formData.mealsServed.alcohol
    ) {
      setDateValidation("Please select at least one meal type.");
      return;
    }
    console.log("location address",locationexist);
    if (!locationexist) { 
      return; 
    }
    const mealsServedArray = [];
    if (formData.mealsServed.veg) mealsServedArray.push("Veg");
    if (formData.mealsServed.nonVeg) mealsServedArray.push("NonVeg");
    if (formData.mealsServed.vegan) mealsServedArray.push("Vegan");
    if (formData.mealsServed.alcohol) mealsServedArray.push("Alcohol");
    const mealType = mealsServedArray.join("|");

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
    const boundary = emissionBoundaryArray.join(", ");

    const requestData = {
      Name: formData.name,
      Type: formData.type,
      ParticipantCount: parseInt(formData.participantCount),
      MealType: mealType,
      LocationAddress: location,
      LocationId: 0,
      MealProvided: formData.mealProvided,
      isShuttleService: formData.isShuttleService,
      RoomsBooked: formData.roomsBooked,
      WaterProvision:
        formData.waterProvision === "PackagedBottle"
          ? "PackagedBottle"
          : "FilledOnSite",
      Boundary: boundary,
      StartDate: formData.startDate,
      EndDate: formData.endDate,
      MealServedCount: formData.mealsServedPerDay,
    };
    try {
      console.log("Data being sent to API:", requestData);
      const result = await postEventData(requestData);
      console.log("Event added successfully:", result);
      setSuccessMessage("Data saved successfully");
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };
  const handleConfirm = () => {
    navigate("/events");
  };
  console.log("Success Message : ", successMessage);
  return (
    <>
  <div className="new-event-page">
  <EcoIndex />
  <div className="main-content">
  <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <AddEventNavbar />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="White_Box">
                  <div className="row">
                    <div className="col-md-12">
                      <form className="firstform" onSubmit={handleSubmit}>
                        <h3>Add Event</h3>
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

                        <div className="row mb-4">
                          <div className="col-md-3">
                            <div className="formdata">
                              <label>Event Name</label>
                              <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="col-md-3">
                            <div className="formdata">
                              <label>Type of Event</label>
                              <select
                                id="eventType"
                                name="type"
                                value={formData.type}
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
                            <div className="formdata">
                              <label>Start Date </label>
                              <input
                                type="date"
                                name="startDate"
                                className="form-control"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="formdata">
                              <label>End Date</label>
                              <input
                                type="date"
                                name="endDate"
                                className="form-control"
                                value={formData.endDate}
                                min={formData.startDate} 
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col-md-3">
                            <div className="formdata">
                              
                                <label>Total Attendees</label>
                                
                              
                             
                                <input
                                  required
                                  type="number"
                                  min={0}
                                  max={9999999999}
                                  name="participantCount"
                                  className="form-control"
                                  value={formData.participantCount}
                                  onChange={handleChange}
                                />
                                
                              
                            </div>
                          </div>
                          <div className="col-md-3">
  <div className="formdata">
    <label>Number of hotel rooms booked</label>
    <input
      required
      type="number"
      min={0}
      max={9999999999}
      name="roomsBooked"
      className="form-control"
      value={formData.roomsBooked}
      onChange={handleChange}
    />
  </div>
</div>
                          

                          <div className="col-md-6">
                            <div className="formdata">
                              <label>Location of Event</label>
                              <div className="location-input-wrapper">
                                <input
                                  required
                                  className="form-control"
                                  id="location"
                                  ref={locationRef} 
                                  placeholder="Enter location"
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                />  
                                <FontAwesomeIcon
                                  icon={faLocationDot}
                                  className="Map_Iocn"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                        <div className="col-md-12">
                          <h3>Emission Boundary<span className="tooltip-icon">
                              <i
                                className="fa fa-info-circle"
                                aria-hidden="true"
                              />
                              <span className="tooltip-text">
                              The Emission Boundary limits the tracking scope for an event. Select the headers for which you wish to track the carbon emissions
                              </span>
                            </span></h3>
                          <hr></hr>
                          </div>
                        </div>
<div className="row">
<div className="col-md-3">
<label>Are you providing meals to?</label>

<select
  className="form-control"
  
  name="mealProvided"
   
  onChange={(e) =>
    setFormData((prevData) => ({
      ...prevData,
      mealProvided: e.target.value === "true",
    }))
  }
>
  <option value="true">All Attendees</option>
  <option value="false">Only Delegates and VVIPs</option>
</select>


    
    
  
</div>
<div className="col-md-3">
                            <div className="formdata">
                            

                            <label>Are you providing Shuttle for Local travel?
                                
                                </label>
                                <select
  className="form-control"
  
  name="isShuttleService"
   
  onChange={(e) =>
    setFormData((prevData) => ({
      ...prevData,
      isShuttleService: e.target.value === "true",
    }))
  }
>
  <option value="true">Yes</option>
  <option value="false">No</option>
</select>
                              {/* <label>Area of Event Space</label>
                              <div className="eventSpace">
                                <input type="number" className="form-control" name="area" value={formData.area} onChange={handleChange} required="true" min={0} max={9999999999} step="0.01" />
                                <select name="areaUnit" value={formData.areaUnit} className="form-control" onChange={handleChange}>
                                  <option value="Sqft">Sqft</option>
                                  <option value="Sqm">Sqm</option>
                                </select>
                              </div> */}
                            </div>
                          </div>


</div>
                        <div className="row mb-4">
                          <div className="col-md-3">
                            <div className="formdata">
                              <label>Meals Served</label>
                              <div className="mainMealsServed">
                                <div className="MealsServed">
                                  <input
                                    type="checkbox"
                                    id="Veg"
                                    className="form-check-input"
                                    name="veg"
                                    checked={formData.mealsServed.veg}
                                    onChange={handleMealChange}
                                  />
                                  <label htmlFor="Veg">Vegetarian</label>
                                </div>
                                <div className="MealsServed">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="NonVeg"
                                    name="nonVeg"
                                    checked={formData.mealsServed.nonVeg}
                                    onChange={handleMealChange}
                                  />
                                  <label htmlFor="NonVeg">Non-Vegetarian</label>
                                </div>
                                <div className="MealsServed">
                                  <input
                                    type="checkbox"
                                    id="Vegan"
                                    name="vegan"
                                    className="form-check-input"
                                    checked={formData.mealsServed.vegan}
                                    onChange={handleMealChange}
                                  />
                                  <label htmlFor="Vegan">Vegan</label>
                                </div>
                                <div className="MealsServed">
                                  <input
                                    type="checkbox"
                                    id="Alcohol"
                                    name="alcohol"
                                    className="form-check-input"
                                    checked={formData.mealsServed.alcohol}
                                    onChange={handleMealChange}
                                  />
                                  <label htmlFor="Alcohol">Alcohol</label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-3">
                            <div className="data formdata">
                              <label>
                              Tick the checkbox to track emissions
                              </label>
                              <div className="mainEmissionBoundary">
                                <div className="EmissionBoundary">
                                  <input
                                    type="checkbox"
                                    name="materialConsumption"
                                    class="form-check-input"
                                    checked={
                                      formData.emissionBoundary
                                        .materialConsumption
                                    }
                                    onChange={handleEmissionChange}
                                  />
                                  <label htmlFor="materialConsumption">
                                    Material Consumption
                                  </label>
                                </div>
                                <div className="EmissionBoundary">
                                  <input
                                    type="checkbox"
                                    name="organicWasteConverter"
                                    class="form-check-input"
                                    checked={
                                      formData.emissionBoundary
                                        .organicWasteConverter
                                    }
                                    onChange={handleEmissionChange}
                                  />
                                  <label htmlFor="organicWasteConverter">
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
                                </div>
                                <div className="EmissionBoundary">
                                  <div className="SubEmissionBoundary">
                                    <div className="optionBoundary mt-2">
                                      <input
                                        type="checkbox"
                                        id="parentCheckbox"
                                        name="wasteDisposal"
                                        class="form-check-input"
                                        checked={isWasteDisposalChecked}
                                        onChange={handleChange}
                                      />
                                      <label htmlFor="parentCheckbox">
                                        Waste Disposal
                                        <span className="tooltip-icon">
                                          <i
                                            className="fa fa-info-circle"
                                            aria-hidden="true"
                                          />
                                          <span className="tooltip-text">
                                            Would you like to track paper,
                                            plastic, and organic waste generated
                                            during the event? Standard default
                                            values will be provided.
                                          </span>
                                        </span>
                                      </label>
                                    </div>

                                    {isWasteDisposalChecked && (
                                      <div className="child-container">
                                        <div className="sub-child-container">
                                          <input
                                            type="checkbox"
                                            id="Recycler"
                                            name="Recycler"
                                            class="form-check-input"
                                            checked={
                                              formData.emissionBoundary
                                                .wasteDisposal.subitem.Recycler
                                            }
                                            onChange={
                                              handleWasteDisposalSubitemChange
                                            }
                                          />
                                          <label htmlFor="Recycler">
                                            Recycler
                                          </label>
                                        </div>
                                        <div className="sub-child-container">
                                          <input
                                            type="checkbox"
                                            id="Landfill"
                                            name="Landfill"
                                            class="form-check-input"
                                            checked={
                                              formData.emissionBoundary
                                                .wasteDisposal.subitem.Landfill
                                            }
                                            onChange={
                                              handleWasteDisposalSubitemChange
                                            }
                                          />
                                          <label htmlFor="Landfill">
                                            Landfill
                                          </label>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-3">
                            <div className="formdata">
                              <label>Water Provision</label>
                              <div className="mainWaterProvision">
                                <div className="WaterProvision">
                                  <input
                                    type="radio"
                                    name="waterProvision"
                                    className="form-check-input"
                                    value="PackagedBottle"
                                    checked={
                                      formData.waterProvision ===
                                      "PackagedBottle"
                                    }
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="PackagedBottle">
                                    Packaged Bottle
                                  </label>
                                </div>
                                <div className="WaterProvision">
                                  <input
                                    type="radio"
                                    name="waterProvision"
                                    className="form-check-input"
                                    value="FilledOnSite"
                                    checked={
                                      formData.waterProvision === "FilledOnSite"
                                    }
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="FilledOnSite">
                                    Filled on-Site
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-12 text-right">
                            <div className="form-buttons">
                              <button type="submit" className="btn save-button">
                                Save
                              </button>
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
    </>
  );
};

export default NewForm;
