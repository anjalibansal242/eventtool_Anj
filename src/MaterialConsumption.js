import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MaterialConsumption.css";
import "../src/assets/styles/bootstrap-4.4.1.css";
import "../src/assets/styles/style.css";

import {
  GetMaterialConsumptionList,
  postMaterialConsumptionList,
  postDuringEventUpdateMementosMaterialFileData,
} from "./apiService";
import { useEvent } from "./EventDetailsContext";
import EventName from "./EventName";
import CustomAlert from "./CustomAlert";

const MaterialConsumption = () => {
  const { eventDetails } = useEvent();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filesByMementoId, setFilesByMementoId] = useState({});
  const locationRefs = {
    printedMaterial: useRef(null),
    packaging: useRef(null),
    plastic: useRef(null),
    paper: useRef(null),
  };

  const [formData, setFormData] = useState({
    printedMaterial: {
      id: "",
      quantity: "",
      modeOfSupply: "",
      locationOfSupplier: "",
    },
    packaging: {
      id: "",
      quantity: "",
      modeOfSupply: "",
      locationOfSupplier: "",
    },
    plastic: { id: "", quantity: "", modeOfSupply: "", locationOfSupplier: "" },
    paper: { id: "", quantity: "", modeOfSupply: "", locationOfSupplier: "" },
    mementos: [],
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [datevalidation, setDateValidation] = useState(null);
  const [placeSelected, setPlaceSelected] = useState({
    printedMaterial: false,
    packaging: false,
    plastic: false,
    paper: false,
  });
  useEffect(() => {
    if (eventDetails) {
      const fetchData = async () => {
        try {
          const data = await GetMaterialConsumptionList(eventDetails.eventId);

          setFormData({
            printedMaterial: {
              id: data.materialConsumptions[0].materialConsumptionId,
              quantity: data.materialConsumptions[0].quantity,
              modeOfSupply: data.materialConsumptions[0].mode,
              locationOfSupplier:
                data.materialConsumptions[0].supplierLocationData.location ||
                "",
              locationOfSupplierId:
                data.materialConsumptions[0].supplierLocationData.locationId ||
                0,
            },
            packaging: {
              id: data.materialConsumptions[1].materialConsumptionId,
              quantity: data.materialConsumptions[1].quantity,
              modeOfSupply: data.materialConsumptions[1].mode,
              locationOfSupplier:
                data.materialConsumptions[1].supplierLocationData.location ||
                "",
              locationOfSupplierId:
                data.materialConsumptions[1].supplierLocationData.locationId ||
                0,
            },
            plastic: {
              id: data.materialConsumptions[2].materialConsumptionId,
              quantity: data.materialConsumptions[2].quantity,
              modeOfSupply: data.materialConsumptions[2].mode,
              locationOfSupplier:
                data.materialConsumptions[2].supplierLocationData.location ||
                "",
              locationOfSupplierId:
                data.materialConsumptions[2].supplierLocationData.locationId ||
                0,
            },
            paper: {
              id: data.materialConsumptions[3].materialConsumptionId,
              quantity: data.materialConsumptions[3].quantity,
              modeOfSupply: data.materialConsumptions[3].mode,
              locationOfSupplier:
                data.materialConsumptions[3].supplierLocationData.location ||
                "",
              locationOfSupplierId:
                data.materialConsumptions[3].supplierLocationData.locationId ||
                0,
            },
            mementos: data.mementosMaterialConsumptions.map((item) => ({
              id: item.mementosMaterialConsumptionId,
              quantity: item.quantity,
              basicMaterial: item.mementosMeterialName,
              weight: item.weight,
              unit: "kg",
              photograph: item.photopath,
            })),
          });
          setPlaceSelected({
            printedMaterial: !!data.materialConsumptions[0].supplierLocationData.location,
            packaging: !!data.materialConsumptions[1].supplierLocationData.location,
            plastic: !!data.materialConsumptions[2].supplierLocationData.location,
            paper: !!data.materialConsumptions[3].supplierLocationData.location,
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

  useEffect(() => {
    const initializeAutocomplete = (field) => {
      const locationInput = locationRefs[field].current;

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
        if (!place.geometry || !place.geometry.location)   
       {
          setPlaceSelected((prev) => ({ ...prev, [field]: false })); 
          return;
        }
      
        setPlaceSelected((prev) => ({ ...prev, [field]: true })); 
        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: {
            ...prevFormData[field],
            locationOfSupplier: place.formatted_address,
          },
        }));
      });
    };

    if (window.google && window.google.maps) {
      Object.keys(locationRefs).forEach(initializeAutocomplete);
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCpdevcXjKt9CVD1n8chB59MGW0d1uT2dg&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () =>
        Object.keys(locationRefs).forEach(initializeAutocomplete);
      document.head.appendChild(script);
    }
  }, [locationRefs]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const handleLocationInputChange = (field) => {
    setPlaceSelected((prev) => ({
      ...prev,
      [field]: false, 
    }));
  };
  
  const handleChange = (e, field, subField, index = null) => {
    if (field === "mementos") {
      const updatedMementos = [...formData.mementos];
      updatedMementos[index] = {
        ...updatedMementos[index],
        [subField]: e.target.value,
      };
      setFormData({ ...formData, mementos: updatedMementos });
    } else {
      setFormData({
        ...formData,
        [field]: {
          ...formData[field],
          [subField]: e.target.value,
        },
      });
    }
    
  };

  const validateForm = () => {
    const { printedMaterial, packaging, plastic, paper, mementos } = formData;

    if (
      Number(printedMaterial.quantity) < 0 ||
      Number(packaging.quantity) < 0 ||
      Number(plastic.quantity) < 0 ||
      Number(paper.quantity) < 0 ||
      mementos.some(
        (memento) => Number(memento.quantity) < 0 || Number(memento.weight) < 0
      )
    ) {
      alert(
        "Please enter positive numbers for all quantity and weight fields."
      );
      return false;
    }

    return true;
  };

  const travelModeMapping = {
    Truck: 15,
    LMV: 14,
  };

  const mementoMaterialMapping = {
    "Plant/Natural": 2,
    Wood: 3,
    Metal: 4,
    Plastic: 5,
  };
  console.log("filesByMementoId", filesByMementoId);
  const handleSubmit = async (e) => {
    e.preventDefault();

  if (Object.values(placeSelected).some(isValid => !isValid)) {
    setAlertMessage(
      "All fields must be filled, and locations must be selected from suggestions."
    );
    setAlertType("error");
    setShowAlert(true);
    return;
  }
    if (!validateForm()) {
      return;
    }

    const postData = {
      materialConsumptions: [
        {
          materialConsumptionId: formData.printedMaterial.id,
          eventId: eventDetails.eventId,
          travelModeId:
            travelModeMapping[formData.printedMaterial.modeOfSupply] || 0,
          Location: {
            locationId: formData.printedMaterial.locationOfSupplierId || 0,
            location: formData.printedMaterial.locationOfSupplier,
          },
          quantity: Number(formData.printedMaterial.quantity),
        },
        {
          materialConsumptionId: formData.packaging.id,
          eventId: eventDetails.eventId,
          travelModeId: travelModeMapping[formData.packaging.modeOfSupply] || 0,
          Location: {
            locationId: formData.packaging.locationOfSupplierId || 0,
            location: formData.packaging.locationOfSupplier,
          },
          quantity: Number(formData.packaging.quantity),
        },
        {
          materialConsumptionId: formData.plastic.id,
          eventId: eventDetails.eventId,
          travelModeId: travelModeMapping[formData.plastic.modeOfSupply] || 0,
          Location: {
            locationId: formData.plastic.locationOfSupplierId || 0,
            location: formData.plastic.locationOfSupplier,
          },
          quantity: Number(formData.plastic.quantity),
        },
        {
          materialConsumptionId: formData.paper.id,
          eventId: eventDetails.eventId,
          travelModeId: travelModeMapping[formData.paper.modeOfSupply] || 0,
          Location: {
            locationId: formData.paper.locationOfSupplierId || 0,
            location: formData.paper.locationOfSupplier,
          },
          quantity: Number(formData.paper.quantity),
        },
      ],
      mementosMaterialConsumptions: formData.mementos.map((item) => ({
        mementosMaterialConsumptionId: item.id,
        eventId: eventDetails.eventId,
        mementosMaterialId: mementoMaterialMapping[item.basicMaterial] || 0,
        quantity: Number(item.quantity),
        weight: Number(item.weight),
      })),
    };

    try {
      await postMaterialConsumptionList(postData);
      for (const [mementoId, file] of Object.entries(filesByMementoId)) {
        const formDataToSend = new FormData();
        formDataToSend.append("MementosMaterialConsumptionId", mementoId);
        formDataToSend.append("EventId", eventDetails.eventId);
        formDataToSend.append("FileData", file);
        await postDuringEventUpdateMementosMaterialFileData(formDataToSend);
      }
      setAlertMessage("Data saved successfully");
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Error saving material consumption data:", error);
      setAlertMessage(
        "Error saving data. Please check your inputs and try again."
      );
      setAlertType("error");
      setShowAlert(true);
    }
  };
  console.log("placeSelected",placeSelected);

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === "success") {
      navigate("/events/post-event-planning/waste-generation");
    }
  };
  const handleAddMementoRow = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      mementos: [
        ...prevFormData.mementos,
        {
          basicMaterial: "",
          quantity: 0,
          weight: 0,
          photograph: null,
        },
      ],
    }));
  };

  const handleRemoveMementoRow = (index) => {
    setFormData((prevFormData) => {
      const newMementos = prevFormData.mementos.filter((_, i) => i !== index);
      return {
        ...prevFormData,
        mementos: newMementos,
      };
    });
  };

  const handleMementoChange = (e, field, name, index) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const newMementos = [...prevFormData.mementos];
      newMementos[index] = {
        ...newMementos[index],
        [name]: value,
      };
      return {
        ...prevFormData,
        mementos: newMementos,
      };
    });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => {
      const newMementos = [...prevFormData.mementos];
      newMementos[index] = {
        ...newMementos[index],
        photograph: file,
      };
      return {
        ...prevFormData,
        mementos: newMementos,
      };
    });
  };

  const isAttendee = eventDetails?.myRole === "Attendee";

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
                        <h3>Material Consumption</h3>
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
                      <div className="col-md-12">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Material</th>
                              <th>Quantity (kg)</th>
                              <th>Mode of Supply</th>
                              <th>
                                Location of Supplier
                                <span className="tooltip-icon">
                                  <i
                                    className="fa fa-info-circle"
                                    aria-hidden="true"
                                    style={{
                                      fontSize: "15px",
                                      color: "#fff",
                                      cursor: "pointer",
                                    }}
                                  />
                                  <span className="tooltip-text">
                                    In case of multiple vendors, add the
                                    location for the farthest vendor
                                  </span>
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Printed Material (Non-Paper)</td>
                              <td>
                                <input
                                  required
                                  type="number"
                                  className="form-control"
                                  value={formData.printedMaterial.quantity}
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "printedMaterial",
                                      "quantity"
                                    )
                                  }
                                  min={0}
                                  max={9999999999}
                                />
                              </td>
                              <td>
                                <select
                                  className="form-control"
                                  value={formData.printedMaterial.modeOfSupply}
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "printedMaterial",
                                      "modeOfSupply"
                                    )
                                  }
                                >
                                  <option value="">Select Mode</option>
                                  <option value="Truck">Truck</option>
                                  <option value="LMV">LMV</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  required={
                                    formData.printedMaterial.quantity > 0
                                  }
                                  type="text"
                                  className="form-control"
                                  ref={locationRefs.printedMaterial}
                                  value={
                                    formData.printedMaterial.locationOfSupplier
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "printedMaterial",
                                      "locationOfSupplier"
                                    )
                                  }
                                  placeholder="Enter location"
                                  onInput={() => handleLocationInputChange("printedMaterial")} 
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Packaging</td>
                              <td>
                                <input
                                  required
                                  type="number"
                                  className="form-control"
                                  value={formData.packaging.quantity}
                                  onChange={(e) =>
                                    handleChange(e, "packaging", "quantity")
                                  }
                                  min={0}
                                  max={9999999999}
                                />
                              </td>
                              <td>
                                <select
                                  className="form-control"
                                  value={formData.packaging.modeOfSupply}
                                  onChange={(e) =>
                                    handleChange(e, "packaging", "modeOfSupply")
                                  }
                                >
                                  <option value="">Select Mode</option>
                                  <option value="Truck">Truck</option>
                                  <option value="LMV">LMV</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  required={formData.packaging.quantity > 0}
                                  type="text"
                                  className="form-control"
                                  ref={locationRefs.packaging}
                                  value={formData.packaging.locationOfSupplier}
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "packaging",
                                      "locationOfSupplier"
                                    )
                                  }
                                  placeholder="Enter location"
                                  onInput={() => handleLocationInputChange("packaging")} 
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Plastic</td>
                              <td>
                                <input
                                  required
                                  type="number"
                                  className="form-control"
                                  value={formData.plastic.quantity}
                                  onChange={(e) =>
                                    handleChange(e, "plastic", "quantity")
                                  }
                                  min={0}
                                  max={9999999999}
                                />
                              </td>
                              <td>
                                <select
                                  className="form-control"
                                  value={formData.plastic.modeOfSupply}
                                  onChange={(e) =>
                                    handleChange(e, "plastic", "modeOfSupply")
                                  }
                                >
                                  <option value="">Select Mode</option>
                                  <option value="Truck">Truck</option>
                                  <option value="LMV">LMV</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  required={formData.plastic.quantity > 0}
                                  type="text"
                                  className="form-control"
                                  ref={locationRefs.plastic}
                                  value={formData.plastic.locationOfSupplier}
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "plastic",
                                      "locationOfSupplier"
                                    )
                                  }
                                  placeholder="Enter location"
                                  onInput={() => handleLocationInputChange("plastic")}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Paper</td>
                              <td>
                                <input
                                  required
                                  type="number"
                                  className="form-control"
                                  value={formData.paper.quantity}
                                  onChange={(e) =>
                                    handleChange(e, "paper", "quantity")
                                  }
                                  min={0}
                                  max={9999999999}
                                />
                              </td>
                              <td>
                                <select
                                  className="form-control"
                                  value={formData.paper.modeOfSupply}
                                  onChange={(e) =>
                                    handleChange(e, "paper", "modeOfSupply")
                                  }
                                >
                                  <option value="">Select Mode</option>
                                  <option value="Truck">Truck</option>
                                  <option value="LMV">LMV</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  required={formData.paper.quantity > 0}
                                  type="text"
                                  className="form-control"
                                  ref={locationRefs.paper}
                                  value={formData.paper.locationOfSupplier}
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "paper",
                                      "locationOfSupplier"
                                    )
                                  }
                                  placeholder="Enter location"
                                  onInput={() => handleLocationInputChange("paper")}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12 Page_Title">
                        <h3>Mementos</h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Basic Material</th>
                              <th>Quantity</th>
                              <th>Weight (kg)</th>
                              <th>Photograph</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.mementos.map((memento, index) => (
                              <tr key={index}>
                                <td>
                                  <select
                                    className="form-control"
                                    value={memento.basicMaterial}
                                    onChange={(e) =>
                                      handleMementoChange(
                                        e,
                                        "mementos",
                                        "basicMaterial",
                                        index
                                      )
                                    }
                                    disabled={isAttendee}
                                  >
                                    <option value="">Select Material</option>
                                    <option value="Plant/Natural">
                                      Plant/Natural
                                    </option>
                                    <option value="Wood">Wood</option>
                                    <option value="Metal">Metal</option>
                                    <option value="Plastic">Plastic</option>
                                    <option value="Others">Others</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={memento.quantity}
                                    onChange={(e) =>
                                      handleMementoChange(
                                        e,
                                        "mementos",
                                        "quantity",
                                        index
                                      )
                                    }
                                    disabled={isAttendee}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={memento.weight}
                                    onChange={(e) =>
                                      handleMementoChange(
                                        e,
                                        "mementos",
                                        "weight",
                                        index
                                      )
                                    }
                                    disabled={isAttendee}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => handleFileChange(e, index)}
                                    disabled={isAttendee}
                                    accept="image/jpeg, image/png"
                                  />
                                </td>
                                <td>
                                  {index === formData.mementos.length - 1 && (
                                    <button
                                      type="button"
                                      className="PlusBtn"
                                      onClick={handleAddMementoRow}
                                    >
                                      <i
                                        className="fa fa-plus-circle"
                                        aria-hidden="true"
                                      ></i>
                                    </button>
                                  )}
                                  {formData.mementos.length > 1 && (
                                    <button
                                      type="button"
                                      className="MinusBtn"
                                      onClick={() =>
                                        handleRemoveMementoRow(index)
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
};

export default MaterialConsumption;
