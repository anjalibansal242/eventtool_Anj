import React, { useState, useEffect } from "react";
import "./WasteGeneration.css";
import {
  GetWasteConsumptionList,
  postWasteConsumptionList,
  useApi,
} from "../../apiService";
import { useEvent } from "../../EventDetailsContext";
import EventName from "../../EventName";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../../CustomAlert"; // Import CustomAlert component
import "../../assets/styles/font-awesome.css";

const WasteGeneration = ({ eventId }) => {
  const { eventDetails } = useEvent();
  const api = useApi();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    paperwaste: { id: "", value: "0", unit: "kgs" },
    plasticwaste: { id: "", value: "0", unit: "kgs" },
    organicwaste: { id: "", value: "0", unit: "kgs" },
    paperRecycle: { id: "", value: "0" },
    paperLandfill: { id: "", value: "0" },
    plasticRecycle: { id: "", value: "0" },
    plasticLandfill: { id: "", value: "0" },
    organicRecycle: { id: "", value: "0" },
    organicLandfill: { id: "", value: "0" },
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success"); // Can be 'success' or 'error'
  useEffect(() => {
    const fetchWasteConsumptionData = async () => {
      try {
        if (eventDetails && eventDetails.eventId) {
          const data = await GetWasteConsumptionList(eventDetails.eventId);

          const Upto2decimals = (v) => parseFloat(v).toFixed(2);

          setFormData({
            paperwaste: {
              id: data[0]?.wasteConsumptionId || "",
              value: Upto2decimals(data[0]?.quantity || "0"),
              unit: "kgs",
            },
            plasticwaste: {
              id: data[1]?.wasteConsumptionId || "",
              value: Upto2decimals(data[1]?.quantity || "0"),
              unit: "kgs",
            },
            organicwaste: {
              id: data[2]?.wasteConsumptionId || "",
              value: Upto2decimals(data[2]?.quantity || "0"),
              unit: "kgs",
            },
            paperRecycle: {
              id: data[0]?.wasteConsumptionId || "",
              value: data[0]?.recyclePercentage || "0",
            },
            paperLandfill: {
              id: data[0]?.wasteConsumptionId || "",
              value: data[0]?.landfillPercentage || "0",
            },
            plasticRecycle: {
              id: data[1]?.wasteConsumptionId || "",
              value: data[1]?.recyclePercentage || "0",
            },
            plasticLandfill: {
              id: data[1]?.wasteConsumptionId || "",
              value: data[1]?.landfillPercentage || "0",
            },
            organicRecycle: {
              id: data[2]?.wasteConsumptionId || "",
              value: data[2]?.recyclePercentage || "0",
            },
            organicLandfill: {
              id: data[2]?.wasteConsumptionId || "",
              value: data[2]?.landfillPercentage || "0",
            },
          });
        } else {
          console.warn(
            "eventDetails or eventDetails.eventId is missing:",
            eventDetails
          );
        }
      } catch (error) {
        console.error("Error fetching waste consumption data:", error);
      }
    };

    fetchWasteConsumptionData();
  }, [eventId, eventDetails]);
  const handleRLChange = (e) => {
    const { name, value } = e.target;
    const newValue = parseInt(value, 10);

    if (newValue > 100) {
      alert("Value cannot be greater than 100");
      return;
    }

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: { ...prevData[name], value: newValue },
      };

      if (name.includes("Recycle")) {
        const landfillName = name.replace("Recycle", "Landfill");
        const landfillValue = 100 - newValue;
        updatedData[landfillName].value = landfillValue < 0 ? 0 : landfillValue;
      } else if (name.includes("Landfill")) {
        const recycleName = name.replace("Landfill", "Recycle");
        const recycleValue = 100 - newValue;
        updatedData[recycleName].value = recycleValue < 0 ? 0 : recycleValue;
      }

      return updatedData;
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: { ...prevData[name], value: value },
      };
      return updatedData;
    });
  };

  const isRecyclerEnabled = eventDetails?.boundary?.includes("Recycler");
  const isLandfillEnabled = eventDetails?.boundary?.includes("Landfill");
  const isWasteDisposalChecked =
    eventDetails?.boundary?.includes("WasteDisposal");

  const UnitConversion = (value, unit) => {
    let convertedValue = parseFloat(value);
    if (unit === "lbs") {
      convertedValue = convertedValue / 2.20462;
    }
    return parseFloat(convertedValue.toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = [
      {
        wasteConsumptionId: parseInt(formData.paperwaste.id, 10),
        eventId: parseInt(eventDetails.eventId, 10),
        quantity: UnitConversion(
          formData.paperwaste.value,
          formData.paperwaste.unit
        ),
        recyclePercentage: parseInt(formData.paperRecycle.value, 10),
        landfillPercentage: parseInt(formData.paperLandfill.value, 10),
      },
      {
        wasteConsumptionId: parseInt(formData.plasticwaste.id, 10),
        eventId: parseInt(eventDetails.eventId, 10),
        quantity: UnitConversion(
          formData.plasticwaste.value,
          formData.plasticwaste.unit
        ),
        recyclePercentage: parseInt(formData.plasticRecycle.value, 10),
        landfillPercentage: parseInt(formData.plasticLandfill.value, 10),
      },
      {
        wasteConsumptionId: parseInt(formData.organicwaste.id, 10),
        eventId: parseInt(eventDetails.eventId, 10),
        quantity: UnitConversion(
          formData.organicwaste.value,
          formData.organicwaste.unit
        ),
        recyclePercentage: parseInt(formData.organicRecycle.value, 10),
        landfillPercentage: parseInt(formData.organicLandfill.value, 10),
      },
    ];

    try {
      const response = await postWasteConsumptionList(postData);
      const eventId = response;

      if (eventId === eventDetails.eventId) {
        setAlertMessage("Data saved successfully");
        setAlertType("success");
        setShowAlert(true);
      } else {
        setAlertMessage(
          "Error saving data. Please check your inputs and try again."
        );
        setAlertType("error");
        setShowAlert(true);
      }
    } catch (error) {
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
  const handleConfirmAlert = () => {
    setShowAlert(false);
    if (alertType === "success") {
      navigate("/events/individual/my-data");
    }
  };

  const isAttendee = eventDetails?.myRole === "Attendee";
  const isOrganic = eventDetails?.boundary.includes("Organic");
  if (isAttendee) {
    return (
      <div className="access-restricted">
        <p style={{ fontSize: "25px", color: "#007272" }}>
          Access Restricted to Event Managers Only
        </p>
        <p style={{ fontSize: "30px", color: "#007272" }}>
          Please fill your details in the{" "}
          <strong>
            <span style={{ color: "#000000" }}>"INDIVIDUAL"</span>
          </strong>{" "}
          Tab
        </p>
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
                    <div className="row">
                      <div className="col-md-12 Page_Title">
                        <h3>
                          Waste Generation
                          <span className="tooltip-icon">
                            <i
                              className="fa fa-info-circle"
                              aria-hidden="true"
                            />
                            <span className="tooltip-text">
                              Default values are displayed based on per capita
                              generation.
                            </span>
                          </span>
                        </h3>
                      </div>

                      <div className="col-md-12">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th height="30"></th>
                              <th></th>
                              {isLandfillEnabled && isRecyclerEnabled && (
                                <th>Recycle %</th>
                              )}
                              {isRecyclerEnabled && isLandfillEnabled && (
                                <th>Landfill %</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Quantity of Paper Waste</td>
                              <td>
                                <div className="eventSpace">
                                  <input
                                    required
                                    type="number"
                                    className="form-control"
                                    name="paperwaste"
                                    value={formData.paperwaste.value}
                                    onChange={handleChange}
                                    disabled={
                                      !isRecyclerEnabled &&
                                      !isLandfillEnabled &&
                                      !isWasteDisposalChecked
                                    }
                                    min={0}
                                    max={9999}
                                    step="any"
                                  />
                                  <select
                                    name="paperwasteUnit"
                                    className="form-control"
                                    onChange={(e) =>
                                      handleUnitChange(e, "paperwaste")
                                    }
                                    disabled={
                                      !isRecyclerEnabled &&
                                      !isLandfillEnabled &&
                                      !isWasteDisposalChecked
                                    }
                                  >
                                    <option value="kgs">Kg</option>
                                    <option value="lbs">Lbs</option>
                                  </select>
                                </div>
                              </td>
                              {isLandfillEnabled && isRecyclerEnabled && (
                                <td>
                                  <input
                                    required
                                    type="number"
                                    className="form-control"
                                    name="paperRecycle"
                                    value={formData.paperRecycle.value}
                                    onChange={handleRLChange}
                                    disabled={
                                      !isRecyclerEnabled &&
                                      !isLandfillEnabled &&
                                      !isWasteDisposalChecked
                                    }
                                  />
                                </td>
                              )}
                              {isRecyclerEnabled && isLandfillEnabled && (
                                <td>
                                  <input
                                    required
                                    type="number"
                                    className="form-control"
                                    name="paperLandfill"
                                    value={formData.paperLandfill.value}
                                    onChange={handleRLChange}
                                    disabled={
                                      !isRecyclerEnabled &&
                                      !isLandfillEnabled &&
                                      !isWasteDisposalChecked
                                    }
                                  />
                                </td>
                              )}
                            </tr>
                            <tr>
                              <td>Quantity of Plastic Waste</td>
                              <td>
                                <div className="eventSpace">
                                  <input
                                    required
                                    type="number"
                                    className="form-control"
                                    name="plasticwaste"
                                    value={formData.plasticwaste.value}
                                    onChange={handleChange}
                                    disabled={
                                      !isRecyclerEnabled &&
                                      !isLandfillEnabled &&
                                      !isWasteDisposalChecked
                                    }
                                    min={0}
                                    max={9999}
                                    step="any"
                                  />
                                  <select
                                    name="plasticwasteUnit"
                                    className="form-control"
                                    onChange={(e) =>
                                      handleUnitChange(e, "plasticwaste")
                                    }
                                    disabled={
                                      !isRecyclerEnabled &&
                                      !isLandfillEnabled &&
                                      !isWasteDisposalChecked
                                    }
                                  >
                                    <option value="kgs">Kg</option>
                                    <option value="lbs">Lbs</option>
                                  </select>
                                </div>
                              </td>
                              {isLandfillEnabled && isRecyclerEnabled && (
                                <td>
                                  <input
                                    required
                                    type="number"
                                    className="form-control"
                                    name="plasticRecycle"
                                    value={formData.plasticRecycle.value}
                                    onChange={handleRLChange}
                                    disabled={
                                      !isRecyclerEnabled &&
                                      !isLandfillEnabled &&
                                      !isWasteDisposalChecked
                                    }
                                  />
                                </td>
                              )}
                              {isRecyclerEnabled && isLandfillEnabled && (
                                <td>
                                  <input
                                    required
                                    type="number"
                                    className="form-control"
                                    name="plasticLandfill"
                                    value={formData.plasticLandfill.value}
                                    onChange={handleRLChange}
                                    disabled={
                                      !isRecyclerEnabled &&
                                      !isLandfillEnabled &&
                                      !isWasteDisposalChecked
                                    }
                                  />
                                </td>
                              )}
                            </tr>
                            <tr>
                              <td>Quantity of Organic Waste</td>
                              <td>
                                <div className="eventSpace">
                                  <input
                                    required
                                    type="number"
                                    className="form-control"
                                    name="organicwaste"
                                    value={
                                      isOrganic
                                        ? 0
                                        : formData.organicwaste.value
                                    }
                                    onChange={handleChange}
                                    disabled={
                                      (!isRecyclerEnabled &&
                                        !isLandfillEnabled &&
                                        !isWasteDisposalChecked) ||
                                      isOrganic
                                    }
                                    min={0}
                                    max={9999}
                                    step="any"
                                  />
                                  <select
                                    name="organicwasteUnit"
                                    className="form-control"
                                    onChange={(e) =>
                                      handleUnitChange(e, "organicwaste")
                                    }
                                    disabled={
                                      (!isRecyclerEnabled &&
                                        !isLandfillEnabled &&
                                        !isWasteDisposalChecked) ||
                                      isOrganic
                                    }
                                  >
                                    <option value="kgs">Kg</option>
                                    <option value="lbs">Lbs</option>
                                  </select>
                                </div>
                              </td>
                              {isLandfillEnabled && isRecyclerEnabled && (
                                <td>
                                  <input
                                    required
                                    type="number"
                                    className="form-control"
                                    name="organicRecycle"
                                    value={formData.organicRecycle.value}
                                    onChange={handleRLChange}
                                    disabled={
                                      (!isRecyclerEnabled &&
                                        !isLandfillEnabled &&
                                        !isWasteDisposalChecked) ||
                                      isOrganic
                                    }
                                  />
                                </td>
                              )}
                              {isRecyclerEnabled && isLandfillEnabled && (
                                <td>
                                  <input
                                    required
                                    type="number"
                                    className="form-control"
                                    name="organicLandfill"
                                    value={formData.organicLandfill.value}
                                    onChange={handleRLChange}
                                    disabled={
                                      (!isRecyclerEnabled &&
                                        !isLandfillEnabled &&
                                        !isWasteDisposalChecked) ||
                                      isOrganic
                                    }
                                  />
                                </td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="col-md-12 text-right">
                      <button type="submit" className="btn save-button">
                        Save
                      </button>
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
            onClose={handleCloseAlert}
            onConfirm={handleConfirmAlert}
          />
        )}
      </div>
    );
  }
};

export default WasteGeneration;
