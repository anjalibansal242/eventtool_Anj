import React, { useState, useEffect } from "react";
import "./PrePlanning.css";
import EventName from "./EventName";
import { useEvent } from "./EventDetailsContext";
import {
  getInvitationsConsumptionList,
  updateInvitationConsumption,
} from "./apiService";
import CustomAlert from "./CustomAlert"; 
import { useNavigate } from 'react-router-dom';
import "./assets/styles/font-awesome.css";


const PrePlanning = () => {
  const navigate = useNavigate(); 
  const { eventDetails } = useEvent();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    invitationsEmails: "",
    invitationsDistributed: "",
    printedMaterials: "",
    weight: "kgs",
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    if (eventDetails) {
      const fetchData = async () => {
        try {
          const data = await getInvitationsConsumptionList(
            eventDetails.eventId
          );
          console.log(data);
          setFormData({
            invitationsEmails: data[0].quantity,
            invitationsDistributed: data[1].quantity,
            printedMaterials: data[2].quantity,
            weight: "kgs",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const UnitConversion = (value, unit) => {
    if (unit === "kgs") {
      return parseFloat(value);
    } else if (unit === "lbs") {
      return parseInt(parseFloat(value) / 2.20462);
    }
    return parseInt(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const consumptionList = [
        {
          eventId: eventDetails.eventId,
          invitationMaterialId: 2,
          quantity: formData.invitationsEmails,
        },
        {
          eventId: eventDetails.eventId,
          invitationMaterialId: 3,
          quantity: formData.invitationsDistributed,
        },
        {
          eventId: eventDetails.eventId,
          invitationMaterialId: 4,
          quantity: UnitConversion(formData.printedMaterials, formData.weight),
        },
      ];
      await updateInvitationConsumption(consumptionList);
      setAlertMessage("Data saved successfully");
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating data", error);
      setAlertMessage("Error saving data. Please check your inputs and try again.");
      setAlertType("error");
      setShowAlert(true);
    }
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === 'success') {
      navigate("/events/during-event-planning/attendee-details");
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
                    <div className="row">
                      <div className="col-md-12 Page_Title">
                        <h3>Invitations and Marketing</h3>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            Number of Invitation and Marketing E-mails Sent
                          </label>
                          <input
                            required
                            type="number"
                            className="form-control"
                            name="invitationsEmails"
                            value={formData.invitationsEmails}
                            onChange={handleChange}
                            min={0}
                            max={9999999999}

                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                        <label>
                                Printed Invitations Distributed
                                    <span className="tooltip-icon">
                                      <i className="fa fa-info-circle" aria-hidden="true" />
                                    <span className="tooltip-text">Includes printed brochures, newsletters, etc</span>
                                </span>
                              </label>
                          <input
                            required
                            type="number"
                            className="form-control"
                            name="invitationsDistributed"
                            value={formData.invitationsDistributed}
                            onChange={handleChange}
                            min={0}
                            max={9999999999}

                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                        <label>
                           Quantity of Printed/Marketing Materials
                                    <span className="tooltip-icon">
                                      <i className="fa fa-info-circle" aria-hidden="true" />
                                    <span className="tooltip-text">Includes flex, banners, hoardings etc</span>
                                </span>
                              </label>
                          <div className="eventSpace">
                            <input
                              required
                              type="number"
                              className="form-control"
                              name="printedMaterials"
                              value={formData.printedMaterials}
                              onChange={handleChange}
                              min={0}
                              max={9999999999}
                            />
                            <select
                              name="weight"
                              className="form-control"
                              value={formData.weight}
                              onChange={handleChange}
                              min={0}
                              max={9999999999}

                            >
                              <option value="kgs">Kgs</option>
                              <option value="lbs">Lbs</option>
                            </select>
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

export default PrePlanning;
