
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getEventConsumptionDetails,
  postEventConsumptionDetails,
} from "./apiService"; // Authorized API
//import { useEvent } from './EventDetailsContext';
import { useLocation } from "react-router-dom";
import EmissionPopup from "./EmissionPopup";
import Lottie from "lottie-react";
import car from "./assets/car.json";
import bus from "./assets/bus.json";
import train from "./assets/train.json";
import flight from "./assets/flight.json";
//import ecologo from "./assets/ecologo.png";
import Arrow from "./assets/Arrow.png";
import mealll from "./assets/mealll.png";
import nonVeg from "./assets/nonVeg.png";
import hline from "./assets/hline.png";
import "./MyData.css";
import ReactSpeedometer from "react-d3-speedometer";

function MyData(eventDetails) {
  //const locationState = useLocation();
  const location =
    eventDetails.eventDetails.location === null
      ? null
      : eventDetails.eventDetails.location;
  const startDate =
    eventDetails.eventDetails.startDate === null
      ? null
      : eventDetails.eventDetails.startDate;
  const endDate =
    eventDetails.eventDetails.endDate === null
      ? null
      : eventDetails.eventDetails.endDate;
  const eventName =
    eventDetails.eventDetails.eventName === null
      ? null
      : eventDetails.eventDetails.eventName;
  //
 // const totalEmission = eventDetails.eventDetails.totalEmission===null ? null : eventDetails.eventDetails.totalEmission;

  //console.log(location, eventDetails.eventDetails.location);
  //const locationState = useLocation();
  //const { location } = locationState.state || {}
  //const location = localStorage.getItem('location');
  const [searchParams] = useSearchParams();

  // const handleMealChange = (e) => {
  //   const { value } = e.target;
  //   setMealMode(value);
  // };
  const mealProvided = eventDetails?.eventDetails?.mealProvided;
  console.log("Meal Provided:", mealProvided);
  const [eventId, setEventId] = useState(searchParams.get("id"));

 //54r const [eventId, setEventId] = useState(searchParams.get("id"));
  //const [eventDetails, setEventDetails] = useState({});
  //const [eventName, setEventName] = useState("");
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
  const [MealMode, setMealMode] = useState("");
  // const [endLocation, setEndLocation] = useState("");

  const [stayDays, setStayDays] = useState(1);
  const [startingLocation, setStartingLocation] = useState("");
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  //const [mealProvided, setMealProvided] = useState("");
  const [formData, setFormData] = useState({
    eventDuration: "0",
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

  //const [startDate, setStartDate] = useState("");
  //const [endDate, setEndDate] = useState("");
  const locationRef = useRef(null);
  const setLocation = (location) => {
    // Your logic to set the location
    console.log("Location set to:", location);
  };
  //const[location,setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [error, setError] = useState(null);
  const [totalEmission, setTotalEmission] = useState();

  // Hard-coded accommodationId
  const accommodationId = 3;

  useEffect(() => {
    if (mealProvided) {
      setMealMode("Veg"); // Default to "Veg" if mealProvided is true
    } else {
      setMealMode(""); // No default if mealProvided is false
    }
  }, [mealProvided]);

  const handleMealChange = (event) => {
    setMealMode(event.target.value);
  };

  useEffect(() => {
    if (eventId) {
      const fetchEventDetails = async () => {
        try {
          const data = await getEventConsumptionDetails(eventId); // Using authorized API
          console.log("Fetched Event Details:", data); // Log the data to check eventName
          // setEventDetails(data);
          // setEventName(data.eventName || "");
          // setStartDate(data.eventStartDate || "");
          // setEndDate(data.eventEndDate || "");
          // setEndLocation(data.location || "");
          //setMealProvided(data.mealProvided || false);
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
  const [placeSelected, setPlaceSelected] = useState(false); 

  console.log("event details :", eventDetails);
  useEffect(() => {
    if (eventDetails.startDate && eventDetails.endDate) {
      const start = new Date(eventDetails.startDate).getDate();
      const end = new Date(eventDetails.endDate).getDate();
      setMinValue(start);
      setMaxValue(end);
    }
  }, [eventDetails.startDate, eventDetails.endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate).getDate();
      const end = new Date(endDate).getDate();
      setMinValue(start);
      setMaxValue(end);
    }
  }, [startDate, endDate]);

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
      "Flight-Economy": 9,
      "Flight-Business": 10,
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

        setPlaceSelected(true);
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
    // Validation
    

    const { mealPreferenceId, travelModeId, fuelModeId } = getIds();
    if (!placeSelected ) {
      setAlertMessage(
        "All fields must be filled, and location must be selected from suggestions."
      );
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    if (!travelModeId || !fuelModeId) {
      setAlertMessage(
        "Please select meal preference, travel mode, and fuel mode"
      );
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    if (
      !stayDays ||
      !startingLocation ||
      !accommodationId 
      
    ) {
      setAlertMessage("All fields must be filled");
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
      EventId: eventDetails.eventId,
      MealPreferenceId: finalMealPreferenceId,
      StayDays: formData.eventDuration || null,
      TravelModeId: travelModeId,
      UserEmail: email,
      UserName: name,
      Location: {
        Location: startingLocation,
        TransportationType: travelModeId,
      },
    };

    try {
      const response = await postEventConsumptionDetails(data); // Using authorized API
      console.log("Data sent:", data);
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
        return <Lottie animationData={bus} className="bus-my" />;
      case "Train":
        return <Lottie animationData={train} className="train-my" />;
      case "Flight":
        return <Lottie animationData={flight} className="flight-my" />;
      default:
        return <Lottie animationData={car} className="car-my" />;
    }
  };

  useEffect(() => {
    const calculatedStayDays = maxValue - minValue + 1;
    setStayDays(calculatedStayDays);
  }, [minValue, maxValue]);

  const extractCityStateCountry = (address) => {
    if (!address) return "N/A";
    const parts = address.split(",").slice(-3);
    return parts.join(", ").trim().replace(/[0-9]/g, '');
  };

  return (
    <div className="containers-add">
      <div className="forms-section">
       {/* <img src={ecologo} alt="" /> */}

        {!loading && eventName && <h2 className="event-name">{eventName}</h2>}
        

        <div className="questions">How will you travel to the Event?</div>
        <div className="radios-group-my">
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
        <div className="radios-group1-my">
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

        <div className="questions-my">
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

        <div className="questions-my-duration">Duration of stay in hotel:</div>

        <div className="duration-container-my">
          <div className="dropdown-wrapper-my">
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
            <div className="radios-group2-my"> 
              {["Veg", "Non-Veg"].map((meal) => (   
                <div key={meal} style={{ display: "flex", alignItems: "center" }}> 
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

      <div className="details-section-my">
        <h3>
          <span>Travel</span> <br /> Details
        </h3>

        <div className="car-image-my">{getAnimation()}</div>

        <div className="journey-details-my">
          <div className="journey-line-my">
            <span className="start-journey-my">
              <i class="fa fa-map-marker" style={{ color: "#D90166" }}></i> {""}
              {extractCityStateCountry(startingLocation)}
            </span>

            <img src={Arrow} alt="" />

            <span>
              <span className="end-journey-my">
                <i className="fa fa-map-marker" style={{ color: "green" }}></i>{" "}
                {""}
                {extractCityStateCountry(location)}
              </span>
            </span>
          </div>

          <div className="date-meal-my">
            <div className="date-meal-details-my">
              <div className="date-box-my">
                <div className="start-date-box-my">
                  <span className="label-my">START DATE</span>
                  <div className="date-my">
                    <span className="day-my">
                      {startDate ? new Date(startDate).getDate() : "14"}
                    </span>
                    <div className="month-year-my">
                      <span className="month-my">
                        {startDate
                          ? new Date(startDate).toLocaleString("default", {
                              month: "short",
                            })
                          : "Sep"}
                      </span>
                      <span className="year-my">
                        {startDate ? new Date(startDate).getFullYear() : "24"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="end-date-box-my">
                  <span className="label-my">END DATE</span>
                  <div className="date-my">
                    <span className="day-my">
                      {endDate ? new Date(endDate).getDate() : "16"}
                    </span>
                    <div className="month-year-my">
                      <span className="month-my">
                        {endDate
                          ? new Date(endDate).toLocaleString("default", {
                              month: "short",
                            })
                          : "Sep"}
                      </span>
                      <span className="year-my">
                        {endDate ? new Date(endDate).getFullYear() : "24"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="meal-type-my">
           {MealMode === "Veg" && (
                <img
                  src={mealll}
                  alt="Veg Meal"
                  style={{ width: "50px", height: "auto" }}
                />
              )}

              {MealMode === "Non-Veg" && (
                <img
                  src={nonVeg}
                  alt="Non-Veg Meal"
                  style={{ width: "50px", height: "auto" }}
                />
              )}
            </div>
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
      ringWidth={window.innerWidth < 768 ? 20 : 40} // smaller ring width on small screens
      valueTextFontSize={"0px"}
    />
  </div>
  <div className="data-list-my">
    <div className="emission-meter-my">🍃 TOTAL EMISSION</div>
    <div 
      className="emission-value-my"
      style={{
        color: totalEmission >= 160  
          ? '#f00018'   
          : totalEmission >= 80   
            ? '#ffa342'  
            : '#4dbce8'  
      }}
    >
      {totalEmission ? `${totalEmission} Kg CO2`  : "Calculating..."}
    </div>
    <div 
      className="emission-level-my"
      style={{
        color: totalEmission >= 160  
          ? '#f00018'
          : totalEmission >= 80   
            ? '#ffa342'
            : '#4dbce8'  
      }}
    >
      {totalEmission >= 160
        ? "Oops! You exceeded the carbon emissions limit."
        : totalEmission >= 80
          ? "You are within the carbon emissions limit."
          : "Great! You are below the carbon emission limit."
      }
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

export default MyData;
 