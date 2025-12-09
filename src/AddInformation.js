import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { addEventConsumptionV2, getPublicEventDetails } from "./apiService";
import EmissionPopup from "./EmissionPopup";
import Lottie from "lottie-react";
import car from "./assets/car.json";
import bus from "./assets/bus.json";
import train from "./assets/train.json";
import flight from "./assets/flight.json";
import ecologo from "./assets/ecologo.png";
import Arrow from "./assets/Arrow.png";
import mealll from "./assets/mealll.png";
import nonVeg from "./assets/nonVeg.png";
import hline from "./assets/hline.png";
import "./AddInformation.css";
import ReactSpeedometer from "react-d3-speedometer";

function AddInformation() {
  const [searchParams] = useSearchParams();
  const [eventId, setEventId] = useState(searchParams.get("id"));
  const [eventDetails, setEventDetails] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [travelMode, setTravelMode] = useState("Car");
  const [fuelOptions, setFuelOptions] = useState([
    "Petrol",
    "Diesel",
    "Electric",
    "CNG",
  ]);

  const [FuelMode, setFuelMode] = useState("Petrol");
  const [MealMode, setMealMode] = useState("Veg");
  const [endLocation, setEndLocation] = useState("");
  const [stayDays, setStayDays] = useState(1);
  const [startingLocation, setStartingLocation] = useState("");
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const locationRef = useRef(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [error, setError] = useState(null);
  const [totalEmission, setTotalEmission] = useState(null);
  const [mealProvided, setMealProvided] = useState("");
  const [formData, setFormData] = useState({
    eventDuration: "0", // default to 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      let newFormData = { ...prevState, [name]: value };

      if (name === "eventDuration") {
        newFormData.eventDuration = value;
      }

      return newFormData;
    });
  };

  // Hard-coded accommodationId
  const accommodationId = 3;

  useEffect(() => {
    if (eventId) {
      const fetchEventDetails = async () => {
        try {
          const data = await getPublicEventDetails(eventId);
          console.log("Fetched Event Details:", data); // Log the data to check eventName
          setEventDetails(data);
          setEventName(data.eventName || "");
          setStartDate(data.eventStartDate || "");
          setEndDate(data.eventEndDate || "");
          setEndLocation(data.location || "");
          setMealProvided(data.mealProvided || false);
        } catch (error) {
          setError("Failed to fetch event details");
        } finally {
          setLoading(false);
        }
      };
      fetchEventDetails();
    } else {
      setError("Event ID is missing");
      setLoading(false);
    }
  }, [eventId]);

  // Function to calculate the difference in days
  const calculateDaysDifference = (start, end) => {
    const startDay = new Date(start);
    const endDay = new Date(end);

    // Calculate the difference in milliseconds
    const difference = endDay - startDay;

    // Convert milliseconds to days
    return Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));
  };
  const handleDaysChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    if (startDate && endDate) {
      // Calculate the number of days between startDate and endDate
      const days = calculateDaysDifference(startDate, endDate);

      // Create a mapping for the event duration
      const newDurationMapping = {};
      for (let i = 0; i <= days + 1; i++) {
        newDurationMapping[i] = i;
      }
      setEventDurationMapping(newDurationMapping);
    }
  }, [startDate, endDate]);
  const [eventDurationMapping, setEventDurationMapping] = useState({ 0: 0 });

  const getIds = () => {
    const mealPreferences = { Veg: 6, "Non-Veg": 7 };
    const travelModes = {
      "Car-Diesel": 1,
      "Car-Petrol": 2,
      "Car-CNG": 3,
      "Car-Electric": 4,
      "Bus-Fuel-Based": 5,
      "Train-Train": 6,
      "Bus-Electric": 7,
      "Flight-Economy": 8,
      "Flight-Business": 13,
    };
    const fuelCombined = `${travelMode}-${FuelMode}`;

    return {
      mealPreferenceId: mealPreferences[MealMode],
      travelModeId: travelModes[fuelCombined],
      fuelModeId: fuelCombined,
    };
  };

  const handleTravelChange = (event) => {
    const selectedMode = event.target.value;
    setTravelMode(selectedMode);

    let defaultFuelMode = "";
    let defaultMealMode = "Veg";

    switch (selectedMode) {
      case "Bus":
        setFuelOptions(["Fuel-Based", "Electric"]);
        defaultFuelMode = "Fuel-Based";
        break;
      case "Train":
        setFuelOptions(["Train"]);
        defaultFuelMode = "Train";
        break;
      case "Flight":
        setFuelOptions(["Economy", "Business"]);
        defaultFuelMode = "Economy";
        break;
      default:
        setFuelOptions(["Petrol", "Diesel", "Electric", "CNG"]);
        defaultFuelMode = "Petrol";
    }

    setFuelMode(defaultFuelMode);
    setMealMode(defaultMealMode);
  };

  const handleFuelChange = (event) => {
    setFuelMode(event.target.value);
  };

  const handleMealChange = (event) => {
    setMealMode(event.target.value);
  };
  const [placeSelected, setPlaceSelected] = useState(false); 
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
          setPlaceSelected(false); // Set placeSelected to false
          return;
        }

        setPlaceSelected(true); // Set placeSelected to true when a valid place is selected
        setStartingLocation(place.formatted_address);
        setLocation(place.formatted_address);
        console.log("Selected place:", place.formatted_address);
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
  
  

  const handleSubmit = async () => {
    // Validation for email and name
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z\s]*$/;

    if (!emailRegex.test(email)) {
      setAlertMessage("Please enter a correct Email ID");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    if (name.trim() === "") {
      setAlertMessage("Name is required");
      setAlertType("error");
      setShowAlert(true);
      return;
    } else if (!nameRegex.test(name)) {
      setAlertMessage("Name can only contain letters and spaces");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    const { mealPreferenceId, travelModeId, fuelModeId } = getIds();

    if (!travelModeId || !fuelModeId) {
      setAlertMessage(
        "Please select meal preference, travel mode, and fuel mode"
      );
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    // Add the placeSelected check here
    if (!stayDays || !placeSelected || !accommodationId || !eventId) {
      setAlertMessage(
        "All fields must be filled, and location must be selected from suggestions."
      );
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    // Conditionally set mealPreferenceId based on mealProvided
    const finalMealPreferenceId = mealProvided ? mealPreferenceId : 9;

    if (!mealProvided) {
      if (!formData.eventDuration || isNaN(Number(formData.eventDuration))) {
        setAlertMessage("Please enter a valid number for Stay Days");
        setAlertType("error");
        setShowAlert(true);
        return;
      }
    }

    const data = {
      AccommodationId: accommodationId,
      EventId: eventId,
      MealPreferenceId: finalMealPreferenceId,
      StayDays: formData.eventDuration ? Number(formData.eventDuration) : null,
      TravelModeId: travelModeId,
      UserEmail: email,
      UserName: name,
      Location: {
        Location: startingLocation,
        TransportationType: travelModeId,
      },
    };

    try {
      console.log("Sending data:", data);

      const response = await addEventConsumptionV2(data);
      console.log("Data saved successfully:", response);

      const emissionValue = response.totalCarbonEmission?.result || 0;
      const roundedEmission = parseFloat(emissionValue).toFixed(2);
      console.log("Rounded Total Emission:", roundedEmission);

      setTotalEmission(roundedEmission);

      setAlertMessage("Data saved successfully");
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Error saving data:", error);
      setAlertMessage(
        "Error saving data. Please check your inputs and try again."
      );
      setAlertType("error");
      setShowAlert(true);
    }
  };
  
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const getAnimation = () => {
    switch (travelMode) {
      case "Bus":
        return <Lottie animationData={bus} className="bus" />;
      case "Train":
        return <Lottie animationData={train} className="train" />;
      case "Flight":
        return <Lottie animationData={flight} className="flight" />;
      default:
        return <Lottie animationData={car} className="car" />;
    }
  };

  const extractCityStateCountry = (address) => {
    if (!address) return "N/A";
    const parts = address.split(",").slice(-3);
    return parts.join(", ").trim();
  };

  return (
    <div className="container-add">
      <div className="forms-section">
        <img src={ecologo} alt="" />

        {!loading && eventName && <h2 className="event-name">{eventName}</h2>}

        <div className="inputs-group">
          <div className="inputsGroup">
            <input
              type="texxt"
              required
              autoComplete="off"
              className="inputs-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="inputsGroup">
            <input
              type="email"
              required
              autoComplete="off"
              className="inputs-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email ID</label>
          </div>
        </div>

        <div className="questions">How will you travel to the Event?</div>
        <div className="radios-group">
          {["Car", "Bus", "Train", "Flight"].map((mode) => (
            <div key={mode} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                id={mode.toLowerCase()}
                required
                style={{ display: "none" }}
                name="travel"
                value={mode}
                checked={travelMode === mode}
                onChange={handleTravelChange}
              />
              <label
                htmlFor={mode.toLowerCase()}
                className="check"
                style={{ marginRight: "8px" }}
              >
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                  <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                  <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
              </label>
              <span>{mode}</span>
            </div>
          ))}
        </div>

        <div className="questions">Type of Transportation:</div>
        <div className="radios-group1">
          {fuelOptions.map((option) => {
            const optionId = option.replace(/\s+/g, "-").toLowerCase();

            return (
              <div
                key={optionId}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  id={optionId}
                  style={{ display: "none" }}
                  name="fuel"
                  value={option}
                  checked={FuelMode === option}
                  onChange={handleFuelChange}
                  required
                />
                <label
                  htmlFor={optionId}
                  className={`check ${optionId}`}
                  style={{ marginRight: "8px" }}
                >
                  <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </label>
                <span>{option}</span>
              </div>
            );
          })}
        </div>

        <div className="questions">Location:</div>

        <div className="questions">
          <span className="locations-icon">
            {" "}
            <i class="fa fa-map-marker" style={{ color: "#D90166" }}></i>
          </span>

          <input
            className="inpuut"
            placeholder="Location"
            ref={locationRef}
            value={startingLocation}
            required
            onChange={(e) => setStartingLocation(e.target.value)}
          />
        </div>

        <div className="questions">Duration of stay in hotel:</div>

        <div className="duration-container">
          <div className="dropdown-wrapper">
            <select
              id="eventDuration"
              name="eventDuration"
              value={formData.eventDuration}
              onChange={handleChange}
              required
            >
              {Object.values(eventDurationMapping).map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
            <span className="night-text">
              Night{formData.eventDuration > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {mealProvided && (
          <>
            <div className="questions">Meal Preference:</div>
            <div className="radios-group2">
              {["Veg", "Non-Veg"].map((meal) => (
                <div
                  key={meal}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    id={meal.toLowerCase().replace(/\s+/g, "-")}
                    style={{ display: "none" }}
                    name="Meal"
                    value={meal}
                    checked={MealMode === meal}
                    onChange={handleMealChange}
                    required
                  />
                  <label
                    htmlFor={meal.toLowerCase().replace(/\s+/g, "-")}
                    className="check"
                    style={{ marginRight: "8px" }}
                  >
                    <svg width="18px" height="18px" viewBox="0 0 18 18">
                      <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                      <polyline points="1 9 7 14 15 4"></polyline>
                    </svg>
                  </label>
                  <span>{meal}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <button onClick={handleSubmit} className="btnn">
          <span class="transition"></span>
          <span class="gradient"></span>
          <span class="label"></span>
          Submit
        </button>
      </div>

      <div className="details-section">
        <h3>
          <span>Travel</span> <br /> Details
        </h3>

        <div className="car-image">{getAnimation()}</div>

        <div className="journey-details">
          <div className="journey-line">
            <span className="start-journey">
              <i class="fa fa-map-marker" style={{ color: "#D90166" }}></i>{" "}
              {extractCityStateCountry(startingLocation)}
            </span>

            <img src={Arrow} alt="" />
            <span className="end-journey">
              <i class="fa fa-map-marker" style={{ color: "green" }}></i>{" "}
              {extractCityStateCountry(endLocation) || "N/A"}
            </span>
          </div>

          <div></div>

          <div className="date-meal">
            <div className="date-meal-details">
              <div className="date-box">
                <div className="start-date-box">
                  <span className="label">START DATE</span>
                  <div className="date">
                    <span className="day">
                      {startDate ? new Date(startDate).getDate() : "14"}
                    </span>
                    <div className="month-year">
                      <span className="month">
                        {startDate
                          ? new Date(startDate).toLocaleString("default", {
                              month: "short",
                            })
                          : "Sep"}
                      </span>
                      <span className="year">
                        {startDate ? new Date(startDate).getFullYear() : "24"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="end-date-box">
                  <span className="label">END DATE</span>
                  <div className="date">
                    <span className="day">
                      {endDate ? new Date(endDate).getDate() : "16"}
                    </span>
                    <div className="month-year">
                      <span className="month">
                        {endDate
                          ? new Date(endDate).toLocaleString("default", {
                              month: "short",
                            })
                          : "Sep"}
                      </span>
                      <span className="year">
                        {endDate ? new Date(endDate).getFullYear() : "24"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {mealProvided && (
              <div className="meal-type">
                {MealMode === "Veg" && (
                  <img
                    src={mealll}
                    alt="Veg Meal"
                    style={{ width: "55px", height: "auto" }}
                  />
                )}

                {MealMode === "Non-Veg" && (
                  <img
                    src={nonVeg}
                    alt="Non-Veg Meal"
                    style={{ width: "55px", height: "auto" }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="emission-section">
          <div className="meter">
            <ReactSpeedometer
               width={window.innerWidth < 768 ? 160 : 230} 
               height={window.innerWidth < 480 ? 160 : 230} 
               needleTransitionDuration={4000}
               needleColor="black"
               value={Math.min(totalEmission || 0, 240)}
               minValue={0}
               maxValue={240}
               segments={3}
               segmentColors={["#4dbce8", "#ffa342", "#f00018"]}
               customSegmentStops={[0, 80, 160, 240]}
               forceRender={true}
               labelFontSize={"0px"}
               ringWidth={window.innerWidth < 768 ? 20 : 40} 
               valueTextFontSize={"0px"}
            />
          </div>
          <div className="data-list">
            <div className="emission-meter">🍃 TOTAL EMISSION</div>
            <div
              className="emission-value"
              style={{
                color:
                  totalEmission >= 160
                    ? "#f00018"
                    : totalEmission >= 80
                    ? "#ffa342"
                    : "#4dbce8",
              }}
            >
              {totalEmission ? `${totalEmission} Kg CO2` : "Calculating..."}
            </div>
            <div
              className="emission-level"
              style={{
                color:
                  totalEmission >= 160
                    ? "#f00018"
                    : totalEmission >= 80
                    ? "#ffa342"
                    : "#4dbce8",
              }}
            >
              {totalEmission >= 160
                ? "Oops! You exceeded the carbon emissions limit."
                : totalEmission >= 80
                ? "You are within the carbon emissions limit."
                : "Great! You are below the carbon emission limit."}
            </div>
          </div>
        </div>
      </div>

      {showAlert && (
        <EmissionPopup
          message={alertMessage}
          onClose={handleCloseAlert}
          onConfirm={handleCloseAlert}
          totalEmission={totalEmission}
        />
      )}
    </div>
  );
}

export default AddInformation;
