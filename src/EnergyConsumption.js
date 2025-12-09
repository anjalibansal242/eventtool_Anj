import React, { useState, useEffect } from "react";
import "./EnergyConsumptionForm.css";
import "../src/assets/styles/bootstrap-4.4.1.css";
import "../src/assets/styles/style.css";
import {
  GetEnergyConsumptionList,
  postEnergyConsumptionList,
  useApi,
} from "./apiService";
import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventDetailsContext";
import EventName from "./EventName";
import CustomAlert from "./CustomAlert"; // Import CustomAlert component

const EnergyConsumptionForm = () => {
  const { eventDetails } = useEvent();
  const navigate = useNavigate();
  const api = useApi();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    electricityConsumption: { id: "", value: "", unit: "kWh" },
    fuelConsumption: { id: "", value: "", unit: "Liters" },
    naturalGas: { id: "", value: "", unit: "m³" },
    lpg: { id: "", value: "", unit: "kg" },
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success"); // Can be 'success' or 'error'

  useEffect(() => {
    if (eventDetails) {
      const fetchData = async () => {
        try {
          const data = await GetEnergyConsumptionList(eventDetails.eventId);
          setFormData({
            electricityConsumption: {
              id: data[0].energyConsumptionId,
              value: data[0].quantity,
              unit: "kWh",
            },
            fuelConsumption: {
              id: data[1].energyConsumptionId,
              value: data[1].quantity,
              unit: "Liters",
            },
            naturalGas: {
              id: data[2].energyConsumptionId,
              value: data[2].quantity,
              unit: "m³",
            },
            lpg: {
              id: data[3].energyConsumptionId,
              value: data[3].quantity,
              unit: "kg",
            },
          });
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [eventDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleInputChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        value: e.target.value,
      },
    });
  };

  const handleUnitChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        unit: e.target.value,
      },
    });
  };

  const UnitConversion = (value, unit) => {
    let convertedValue = parseFloat(value);
    if (unit === "MWh") {
      convertedValue *= 1000;
    } else if (unit === "ft3") {
      convertedValue /= 35.3147;
    } else if (unit === "gallons") {
      convertedValue /= 0.264172;
    } else if (unit === "lb") {
      convertedValue /= 2.20462;
    }
    return parseFloat(convertedValue.toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = [
      {
        EnergyConsumptionId: formData.electricityConsumption.id,
        EventId: eventDetails.eventId,
        Quantity: UnitConversion(
          formData.electricityConsumption.value,
          formData.electricityConsumption.unit
        ),
      },
      {
        EnergyConsumptionId: formData.fuelConsumption.id,
        EventId: eventDetails.eventId,
        Quantity: UnitConversion(
          formData.fuelConsumption.value,
          formData.fuelConsumption.unit
        ),
      },
      {
        EnergyConsumptionId: formData.naturalGas.id,
        EventId: eventDetails.eventId,
        Quantity: UnitConversion(
          formData.naturalGas.value,
          formData.naturalGas.unit
        ),
      },
      {
        EnergyConsumptionId: formData.lpg.id,
        EventId: eventDetails.eventId,
        Quantity: UnitConversion(formData.lpg.value, formData.lpg.unit),
      },
    ];

    try {
      await postEnergyConsumptionList(postData);
      console.log("post", postData);
      setAlertMessage("Data saved successfully");
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Error adding event:", error);
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
      navigate("/events/during-event-planning/meal-consumption");
    }
  };

  const isAttendee = eventDetails?.myRole === "Attendee";
  if (isAttendee) {
    return (
      <div className="access-restricted">
        <p style={{ fontSize: '25px',color: '#007272' }}>Access Restricted to Event Managers Only</p>
        <p style={{ fontSize: '30px',color: '#007272' }}>Please fill your details in the <strong><span style={{ color: '#000000' }}>"INDIVIDUAL"</span>
        </strong> Tab</p>
      </div>
    );
  } else {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="White_Box">
              <div className="row">
                <div className="col-md-12">
                  <EventName />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-12 Page_Title">
                        <h3>Energy Consumption</h3>
                      </div>
                    </div>
                    <div className="row  mb-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Electricity Consumption</label>
                          <div className="row">
                            <div className="col-md-8">
                              <input
                                required
                                type="number"
                                name="electricity"
                                className="form-control"
                                value={formData.electricityConsumption.value}
                                onChange={(e) =>
                                  handleInputChange(e, "electricityConsumption")
                                }
                                min={0}
                                max={9999999999}
                              />
                            </div>
                            <div className="col-md-4">
                              <select
                                name="electricityUnit"
                                className="form-control"
                                onChange={(e) =>
                                  handleUnitChange(e, "electricityConsumption")
                                }
                                value={formData.electricityConsumption.unit}
                              >
                                <option value="kWh">kWh</option>
                                <option value="MWh">MWh</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Fuel Consumption (Diesel)</label>
                          <div className="row">
                            <div className="col-md-8">
                              <input
                                required
                                type="number"
                                name="diesel"
                                className="form-control"
                                value={formData.fuelConsumption.value}
                                onChange={(e) =>
                                  handleInputChange(e, "fuelConsumption")
                                }
                                min={0}
                                max={9999999999}
                              />
                            </div>
                            <div className="col-md-4">
                              <select
                                name="dieselUnit"
                                className="form-control"
                                onChange={(e) =>
                                  handleUnitChange(e, "fuelConsumption")
                                }
                                value={formData.fuelConsumption.unit}
                              >
                                <option value="Liters">Liters</option>
                                <option value="gallons">Gallons</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Natural Gas</label>
                          <div className="row">
                            <div className="col-md-8">
                              <input
                                required
                                type="number"
                                name="naturalGas"
                                className="form-control"
                                value={formData.naturalGas.value}
                                onChange={(e) =>
                                  handleInputChange(e, "naturalGas")
                                }
                                min={0}
                                max={9999999999}
                              />
                            </div>
                            <div className="col-md-4">
                              <select
                                name="naturalGasUnit"
                                className="form-control"
                                onChange={(e) =>
                                  handleUnitChange(e, "naturalGas")
                                }
                                value={formData.naturalGas.unit}
                              >
                                <option value="m3">m³</option>
                                <option value="ft3">ft³</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>LPG</label>
                          <div className="row">
                            <div className="col-md-8">
                              <input
                                required
                                type="number"
                                name="lpg"
                                className="form-control"
                                value={formData.lpg.value}
                                onChange={(e) => handleInputChange(e, "lpg")}
                                min={0}
                                max={9999999999}
                              />
                            </div>
                            <div className="col-md-4">
                              <select
                                name="lpgUnit"
                                className="form-control"
                                onChange={(e) => handleUnitChange(e, "lpg")}
                                value={formData.lpg.unit}
                              >
                                <option value="kg">kg</option>
                                <option value="lb">lb</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 text-right">
                        <button
                          type="submit"
                          className="btn save-button margnRight"
                        >
                          Save
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
    );
  }
};

export default EnergyConsumptionForm;
