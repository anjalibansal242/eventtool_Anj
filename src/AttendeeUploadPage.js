import React, { useState, useEffect } from "react";
import "./SummaryComponent.css";
import EventName from "./EventName";
import "./attendeeDetails.css";
import { useEvent } from "./EventDetailsContext";
import { UpdateAttendeeSummary } from "./apiService";
import CustomAlert from "./CustomAlert";

const AttendeeUploadPage = () => {
  const { eventDetails } = useEvent();
  const [validation, setValidation] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    travelEntries: [],
    accommodation: {
      NA: 0,
      Star3: 0,
      Star4: 0,
      Star5: 0,
    },
    meals: {
      veg: 0,
      nonveg: 0,
      vegan: 0,
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
      travelEntries: travelEntries,
    }));
  }, [travelEntries]);

  console.log("travelEntries", travelEntries);

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
  const uniqueM = getUniqueModes();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let accommodationEntries = [];
    let mealEntries = [];
    let TravelToSend = [];
    const accommodationData = formData.accommodation;
    const mealData = formData.meals;

    const allTravelEntriesValid = formData.travelEntries.every(
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

    const atLeastOneAccommodationFilled = Object.values(accommodationData).some(
      (value) => value > 0
    );

    if (!atLeastOneAccommodationFilled) {
      setValidation("Please provide at least one accommodation type.");
      return;
    }
    const atLeastOneMealFilled = Object.values(mealData).some(
      (value) => value > 0
    );

    if (!atLeastOneMealFilled) {
      setValidation("Please provide at least one Meal type.");
      return;
    }

    mealEntries = Object.keys(mealData)
      .map((key) => {
        const MealMap = {
          veg: 6,
          nonveg: 7,
          vegan: 8,
        };
        return {
          MealId: MealMap[key],
          AttendeeCount: Number(mealData[key]),
        };
      })
      .filter((entry) => entry.AttendeeCount > 0);

    const travel = formData.travelEntries;
    TravelToSend = travel.map((entry) => {
      const mode = travelModes.find(
        (travelModes) =>
          travelModes.mode === entry.Travel &&
          travelModes.type === entry.Transportation
      );

      return {
        TravelModeId: mode ? mode.travelModeId : null,
        AttendeeCount: Number(entry.NumberOfPeople),
        AvgDistance: Number(entry.AverageDistance),
      };
    });

    accommodationEntries = Object.keys(accommodationData)
      .map((key) => {
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
      })
      .filter((entry) => entry.AttendeeCount > 0);

    const postData = {
      EventId: eventDetails?.eventId,
      TravelEntries: TravelToSend,
      AccommodationEntries: accommodationEntries,
      Meals: mealEntries,
    };

    console.log(postData);
    try {
      const response = await UpdateAttendeeSummary(postData);
      if (response === "Attendee summary updated successfully.") {
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
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (errorMessage) {
  //   return <div>Error: {errorMessage}</div>;
  // }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="White_Box">
            <div className="row">
              <div className="col-md-12">
                <div className="attendee-details">
                  <EventName />
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
                      // onConfirm={handleConfirm}
                    />
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-12">
                        <h4>Attendee Details</h4>
                        <div className="input-group"></div>
                        <section className="summary-section">
                          <h4>Travel</h4>
                          <table className="summary-table">
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
                                      className="form-control width100"
                                      value={entry.Travel}
                                      onChange={(e) => handleChange(index, e)}
                                    >
                                      <option value="">
                                        Select Travel Mode
                                      </option>
                                      {uniqueM.map((option, i) => (
                                        <option key={i} value={option.mode}>
                                          {option.mode}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <select
                                      name="Transportation"
                                      className="form-control width100"
                                      value={entry.Transportation}
                                      onChange={(e) => handleChange(index, e)}
                                    >
                                      <option value="">
                                        Select Transportation
                                      </option>

                                      {entry.TransportationOptions?.map(
                                        (option, i) => (
                                          <option key={i} value={option.value}>
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
                                      className="form-control width100"
                                      value={entry.NumberOfPeople}
                                      onChange={(e) => handleChange(index, e)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      name="AverageDistance"
                                      className="form-control width100"
                                      value={entry.AverageDistance}
                                      onChange={(e) => handleChange(index, e)}
                                      step={0.01}
                                    />
                                  </td>
                                  <td>km</td>
                                  <td>
                                    {index === travelEntries.length - 1 && (
                                      <button
                                        type="button"
                                        className="PlusBtn"
                                        onClick={handleAddRow}
                                      >
                                        <i
                                          class="fa fa-plus-circle"
                                          aria-hidden="true"
                                        ></i>
                                      </button>
                                    )}
                                    {travelEntries.length > 1 && (
                                      <button
                                        type="button"
                                        className="MinusBtn"
                                        onClick={() => handleRemoveRow(index)}
                                      >
                                        <i
                                          class="fa fa-minus-circle"
                                          aria-hidden="true"
                                        ></i>
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </section>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <section className="accommodation-details">
                          <h3 className="rowTitle">Stay Information</h3>
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
                                    value={formData.accommodation.NA}
                                    onChange={(e) =>
                                      handleOnlineChange(
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
                                    value={formData.accommodation.Star3}
                                    onChange={(e) =>
                                      handleOnlineChange(
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
                                    value={formData.accommodation.Star4}
                                    onChange={(e) =>
                                      handleOnlineChange(
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
                                    value={formData.accommodation.Star5}
                                    onChange={(e) =>
                                      handleOnlineChange(
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
                        </section>
                      </div>

                      <div className="col-md-6">
                        <section className="meal-details">
                          <h4>Meals</h4>
                          <table className="table Meetingtable">
                            <thead>
                              <tr>
                                <th>Provided </th>
                                <th>Total number served</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Veg</td>
                                <td>
                                  <input
                                    type="number"
                                    name="veg"
                                    className="form-control"
                                    value={formData.meals.veg}
                                    onChange={(e) =>
                                      handleOnlineChange("meals", "veg", e)
                                    }
                                    min={0}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Non-veg</td>
                                <td>
                                  <input
                                    type="number"
                                    name="nonveg"
                                    className="form-control"
                                    value={formData.meals.nonveg}
                                    onChange={(e) =>
                                      handleOnlineChange("meals", "nonveg", e)
                                    }
                                    min={0}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Vegan</td>
                                <td>
                                  <input
                                    type="number"
                                    name="vegan"
                                    className="form-control"
                                    value={formData.meals.vegan}
                                    onChange={(e) =>
                                      handleOnlineChange("meals", "vegan", e)
                                    }
                                    min={0}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </section>
                      </div>

                      <div className="col-md-12">
                        <div className="btngroup">
                          <button className="summary-button">Save</button>
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
  );
};

export default AttendeeUploadPage;
