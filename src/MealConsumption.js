import React, { useState, useEffect } from "react";
import "./MealConsumption.css";
import "../src/assets/styles/bootstrap-4.4.1.css";
import "../src/assets/styles/style.css";
import {
  GetMealConsumptionList,
  postMealConsumptionList,
  useApi,
} from "./apiService";
import { useEvent } from "./EventDetailsContext";
import EventName from "./EventName";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CustomAlert from "./CustomAlert"; // Import CustomAlert component
import { Colors } from "chart.js";

const MealConsumption = () => {
  const { eventDetails } = useEvent();
  const api = useApi();
  const navigate = useNavigate(); // Initialize useNavigate
  const [isAlcohol, setIsAlcohol] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    totalMealCount: { id: "", value: "" },
    snackHighTeaCount: { id: "", value: "" },
    softDrinkCount: { id: "", value: "" },
    hotDrinkCount: { id: "", value: "" },
    alcohol: { id: "", value: "" },
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success'); // Can be 'success' or 'error'

  useEffect(() => {
    if (eventDetails) {
      const fetchData = async () => {
        try {
          const data = await GetMealConsumptionList(eventDetails.eventId);
          const mealTypeArray = eventDetails.mealType.split("|");
          setIsAlcohol(mealTypeArray.includes("Alcohol"));

          setFormData({
            totalMealCount: {
              id: data[0].mealConsumptionId,
              value: data[0].quantity,
            },
            snackHighTeaCount: {
              id: data[0].mealConsumptionId,
              value: data[0].quantity,
            },
            softDrinkCount: {
              id: data[1].mealConsumptionId,
              value: data[1].quantity,
            },
            hotDrinkCount: {
              id: data[2].mealConsumptionId,
              value: data[2].quantity,
            },
            alcohol: { id: data[3].mealConsumptionId, value: data[3].quantity },
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

  const handleChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        value: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = [
      {
        MealConsumptionId: formData.snackHighTeaCount.id,
        EventId: eventDetails.eventId,
        Quantity: formData.snackHighTeaCount.value,
      },
      {
        MealConsumptionId: formData.softDrinkCount.id,
        EventId: eventDetails.eventId,
        Quantity: formData.softDrinkCount.value,
      },
      {
        MealConsumptionId: formData.hotDrinkCount.id,
        EventId: eventDetails.eventId,
        Quantity: formData.hotDrinkCount.value,
      },
      {
        MealConsumptionId: formData.alcohol.id,
        EventId: eventDetails.eventId,
        Quantity: formData.alcohol.value,
      },
    ];
    try {
      await postMealConsumptionList(postData);
      setAlertMessage("Data saved successfully");
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Error saving meal consumption data:", error);
      setAlertMessage("Error saving data. Please check your inputs and try again.");
      setAlertType("error");
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === 'success') {
      navigate("/events/during-event-planning/material-consumption");
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
                        <h3>Snacks/Drinks Consumed</h3>
                      </div>
                    </div>
                    <div className="row mb-3">
                    <div className="col-md-4">
<label>Number of Plates Consumed</label>
                      <input type="text" class="form-control"  />
                      </div>
                      <div className="col-md-4">
                        <div className="form-group Total_Meal_Count">
                          <label>Total Meal Count</label>
                          <input required
                            type="number"
                            name="totalMealCount"
                            className="form-control"
                            value={formData.totalMealCount.value}
                            onChange={(e) => handleChange(e, "totalMealCount")}
                            min={0}
                            max={9999999999}
                          />
                        </div>
                        <div className="form-group">
                          <label>Snack / High Tea </label>
                          <input required
                            type="number"
                            name="snackHighTeaCount"
                            className="form-control"
                            value={formData.snackHighTeaCount.value}
                            onChange={(e) =>
                              handleChange(e, "snackHighTeaCount")
                            }
                            min={0}
                            max={9999999999}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label>Soft Drink </label>
                        <div className="input-group">
                          <input required
                            type="number"
                            name="softDrinkCount"
                            className="form-control"
                            value={formData.softDrinkCount.value}
                            onChange={(e) => handleChange(e, "softDrinkCount")}
                            min={0}
                            max={9999999999}
                          />
                          <div className="input-group-append">
                          <span className="Serves_Txt">Litre</span>
                          </div>
                        </div>
                      </div>

                      
                    </div>

                    <div className="row mb-3">
                      
                    <div className="col-md-4">
                        <label>Alcohol</label>
                        <div className="input-group">
                          <input required
                            type="number"
                            name="alcohol"
                            className="form-control"
                            value={formData.alcohol.value}
                            onChange={(e) => handleChange(e, "alcohol")}
                            disabled={!isAlcohol}
                            min={0}
                            max={9999999999}
                          />
                          <div className="input-group-append">
                          <span className="Serves_Txt">Litre</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label>Hot Drink </label>
                        <div className="input-group">
                          <input required
                            type="number"
                            name="hotDrinkCount"
                            className="form-control"
                            value={formData.hotDrinkCount.value}
                            onChange={(e) => handleChange(e, "hotDrinkCount")}
                            min={0}
                            max={9999999999}
                          />
                          <div className="input-group-append">
                            <span className="Serves_Txt">Litre</span>
                          </div>
                        </div>
                      </div>
                      
                    </div>

                    

                    <div className="row">
                      <div className="col-md-12 text-right">
                        <button type="submit" className="btn save-button">
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

export default MealConsumption;
