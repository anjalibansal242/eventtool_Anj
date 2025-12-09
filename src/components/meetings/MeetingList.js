import "./MeetingList.css";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getMeetingList,
  deleteMeeting,
  getMeetingSummary,
} from "../../apiService";
import { useEvent } from "../../EventDetailsContext";
import AddMeeting from "./AddMeeting";
import UploadMeetingSummary from "./UploadMeetingSummary";
import { Modal, Button, Table, Tooltip, OverlayTrigger } from "react-bootstrap";
import MeetingSummary from "./MeetingSummary";
import CustomAlert from "../../CustomAlert";
import EventName from "../../EventName";
import { QRCodeCanvas } from "qrcode.react";
import logoSrc from "../../assets/ecologo.png";

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetings, setSelectedMeetings] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [filledCount, setFilledCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const { eventDetails } = useEvent();
  const eventId = eventDetails ? eventDetails.eventId : null;
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState();
  const [meetingLocked, setMeetingLocked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!eventDetails) {
          throw new Error("Event details not available");
        }
        const eventId = eventDetails.eventId;
        const data = await getMeetingSummary(eventId);
        setMeetingLocked(data.isMeetinglocked);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [eventDetails, meetings]);
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === "create") {
      navigate("/events/pre-event-planning/add-meetings");
    } else if (e.target.value === "summary") {
      navigate("/events/pre-event-planning/upload-meeting-summary");
    }
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        if (!eventDetails) {
          throw new Error("Event details not available");
        }

        console.log("Fetching meetings for EventId:", eventId);
        const data = await getMeetingList(eventId);
        console.log("Meeting List Data:", data);
        if (data && Array.isArray(data)) {
          setMeetings(data);
        } else {
          console.log("Unexpected data format or empty data:", data);
        }
      } catch (error) {
        console.error("Error fetching meeting data:", error);
      }
    };

    fetchMeetings();
  }, [eventDetails]);

  useEffect(() => {
    console.log("Meetings state updated:", meetings);
  }, [meetings]);

  const handleAddMeetingClick = (meeting) => {
    if (meeting) {
      navigate("/events/pre-event-planning/add-meetings", {
        state: { meeting },
      });
    }
  };

  const handleUploadSummaryClick = () => {
    navigate("/events/pre-event-planning/upload-meeting-summary");
  };

  const handleCheckBoxChange = (meetingId) => {
    setSelectedMeetings((prevSelectedMeetings) => {
      if (prevSelectedMeetings.includes(meetingId)) {
        return prevSelectedMeetings.filter((id) => id !== meetingId);
      } else {
        return [...prevSelectedMeetings, meetingId];
      }
    });
  };

  const handleSelectAllChange = () => {
    setSelectAll((prevSelectAll) => {
      const newSelectAll = !prevSelectAll;
      if (newSelectAll) {
        setSelectedMeetings(meetings.map((meeting) => meeting.id));
      } else {
        setSelectedMeetings([]);
      }
      return newSelectAll;
    });
  };

  const handleDeleteMeetings = () => {
    if (selectedMeetings.length === 0) {
      setAlertMessage("Please select a meeting");
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    setAlertMessage("Are you sure you want to delete the selected meetings?");
    setAlertType("warning");
    setShowAlert(true);
    setConfirmationAction(() => confirmDelete);
  };

  const confirmDelete = async () => {
    try {
      await deleteMeeting(selectedMeetings);
      const data = await getMeetingList(eventId);
      setMeetings(data);
      setSelectedMeetings([]);
      setAlertMessage("Selected meetings deleted successfully.");
      setAlertType("success");
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting meetings:", error);
      setAlertMessage("An error occurred while deleting meetings.");
      setAlertType("error");
    } finally {
      setShowAlert(true);
      setConfirmationAction(null);
    }
  };

  const linkto = `${process.env.REACT_APP_BASE_URL}add-information?id=${eventDetails.eventId}`;

  const generateImage = () => {
    const qrCanvas = canvasRef.current.querySelector("canvas");

    const qrDataUrl = qrCanvas.toDataURL("image/png", 1.0);

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = 850 * 2;
    finalCanvas.height = 1200 * 2;
    const ctx = finalCanvas.getContext("2d");

    ctx.scale(2, 2);

    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, finalCanvas.width / 2, finalCanvas.height / 2);

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#007272";
    ctx.strokeRect(
      20,
      20,
      finalCanvas.width / 2 - 40,
      finalCanvas.height / 2 - 40
    );

    ctx.font = '32px "Montserrat", sans-serif';
    ctx.fillStyle = "#007272";
    ctx.textAlign = "center";
    ctx.fillText("Please scan and share", finalCanvas.width / 4, 125);

    ctx.fillText("your details to make", finalCanvas.width / 4, 175);

    const ToFitText = (
      context,
      text,
      x,
      y,
      maxWidth,
      initialFontSize,
      minFontSize,
      lineHeight
    ) => {
      let fontSize = initialFontSize;
      context.font = `bold ${fontSize}px "Lora", serif`;
      let textWidth = context.measureText(text).width;

      while (textWidth > maxWidth && fontSize > minFontSize) {
        fontSize -= 2;
        context.font = `bold ${fontSize}px "Lora", serif`;
        textWidth = context.measureText(text).width;
      }

      if (textWidth > maxWidth) {
        const words = text.split(" ");
        let line = "";
        let newY = y;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          const testWidth = context.measureText(testLine).width;
          if (testWidth > maxWidth && i > 0) {
            context.fillText(line, x, newY);
            line = words[i] + " ";
            newY += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, newY);
      } else {
        context.fillText(text, x, y);
      }
    };

    ToFitText(
      ctx,
      eventDetails.eventName,
      finalCanvas.width / 4,
      260,
      finalCanvas.width / 2 - 40,
      80,
      40,
      30
    );

    ctx.font = '40px "Montserrat", sans-serif';
    ctx.fillStyle = "#007272";
    ctx.fillText("A", finalCanvas.width / 4, 350);
    ctx.fillText("Carbon", finalCanvas.width / 4, 390);
    ctx.fillText("Neutral Event", finalCanvas.width / 4, 430);

    const qrSize = 500;
    const qrX = (finalCanvas.width / 2 - qrSize) / 2;
    const qrY = 470;
    const qrImage = new Image();
    qrImage.src = qrDataUrl;
    qrImage.onload = () => {
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
      const logoImage = new Image();
      logoImage.src = logoSrc;
      logoImage.onload = () => {
        const logoWidth = 140;
        const logoHeight = 40;
        const logoX = 40;
        const logoY = 40;
        ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

        ctx.font = '28px "Montserrat", sans-serif';
        ctx.fillStyle = "#007272";
        ctx.fillText(
          "Thank you for your contribution!",
          finalCanvas.width / 4,
          qrY + qrSize + 100
        );

        const finalDataUrl = finalCanvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = finalDataUrl;
        downloadLink.download = `Add Information: ${eventDetails.eventName}.png`;
        downloadLink.click();
      };
    };
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(linkto).then(() => {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    });
  };
  useEffect(() => {
    if (selectedMeetings.length === meetings.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedMeetings, meetings]);

  const handleShow = (meetingStatus) => {
    const updatedUserDetails = meetingStatus.map((status) => ({
      email: status.userEmail,
      name: status.name,
      filled: status.accommodationId !== null,
    }));
    setUserDetails(updatedUserDetails);
    setFilledCount(updatedUserDetails.filter((user) => user.filled).length);

    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  console.log("meetingLocked", meetingLocked);
  const renderTooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="White_Box">
            <div className="row">
              <div className="col-md-12">
                <EventName />

                <>
                  <div className="row">
                    <div className="col-md-12 text-center mb-3">
                      <div className="form-check-inline">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            meetingLocked ? (
                              renderTooltip(
                                "This option is disabled because you've already filled the summary"
                              )
                            ) : (
                              <></>
                            )
                          }
                        >
                          <span>
                            <input
                              type="radio"
                              name="meetingOption"
                              className="form-check-input"
                              value="create"
                              checked={selectedOption === "create"}
                              onChange={handleOptionChange}
                              disabled={meetingLocked}
                            />
                            Create Individual Meetings and Send invite to
                            Organizers{" "}
                          </span>
                        </OverlayTrigger>
                      </div>
                      <div className="form-check-inline">
                        <label className="form-check-label" htmlFor="radio2">
                          <input
                            type="radio"
                            name="meetingOption"
                            className="form-check-input"
                            value="summary"
                            checked={selectedOption === "summary"}
                            onChange={handleOptionChange}
                          />
                          Fill Summary for Meetings
                        </label>
                      </div>
                    </div>
                  </div>
                </>

                <>
                  <div className="sort-delete-container">
                    <span>
                      <div className="deleteBtn-container">
                        <i
                          className="fa fa-trash"
                          aria-hidden="true"
                          onClick={handleDeleteMeetings}
                        ></i>
                        <span className="delete-tooltip">Delete</span>
                      </div>
                    </span>
                  </div>
                  {!meetingLocked ? (
                    <div>
                      <div>
                        <Link to="/events/pre-event-planning/add-meetings">
                          <button
                            className="btn AddEventBtn"
                            disabled={meetingLocked}
                          >
                            Add Meeting
                          </button>
                        </Link>
                      </div>
                      <div className="qr-code-section">
                        <div ref={canvasRef}>
                          <QRCodeCanvas
                            value={linkto}
                            size={256}
                            style={{ display: "none" }}
                            level="M"
                            marginSize={2}
                            title={eventDetails.eventName}
                          />{" "}
                          <button
                            className="btn GreenBtn"
                            onClick={generateImage}
                            disabled={meetingLocked}
                          >
                            Download QR Code
                          </button>
                          <button
                            className="btn GreenBtn"
                            onClick={copyLinkToClipboard}
                            disabled={meetingLocked}
                          >
                            Copy Link
                          </button>
                          {showToast && (
                            <div className="toast-notification">
                              Link copied to clipboard!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="clearfix"></div>
                  <div className="Meetingtable_Scroll_Wrp">
                    <table className="table Meetingtable">
                      <thead>
                        <tr>
                          <th className="text-center">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAllChange}
                            />
                          </th>
                          <th>Names</th>
                          <th>Type</th>
                          <th>Date</th>
                          <th>Action</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meetings.length > 0 ? (
                          meetings.map((meeting) => {
                            const filled = meeting.status.filter(
                              (user) => user.accommodationId !== null
                            ).length;
                            const totalUsers = meeting.status.length;
                            return (
                              <tr key={meeting.id}>
                                <td align="center">
                                  <input
                                    type="checkbox"
                                    checked={selectedMeetings.includes(
                                      meeting.id
                                    )}
                                    onChange={() =>
                                      handleCheckBoxChange(meeting.id)
                                    }
                                  />
                                </td>
                                <td>{meeting.name}</td>
                                <td>{meeting.meetingType}</td>
                                <td>{meeting.meetingStartDate}</td>
                                <td>
                                  <button
                                    className="btn edit-button"
                                    onClick={() =>
                                      handleAddMeetingClick(meeting)
                                    }
                                  >
                                    View
                                  </button>
                                </td>
                                <td>
                                  {meeting.meetingType === "offline" && (
                                    <>
                                      <Button
                                        className="custom-button"
                                        variant="primary"
                                        onClick={() =>
                                          handleShow(meeting.status)
                                        }
                                      >
                                        {filled}/{totalUsers}
                                      </Button>
                                      <Modal
                                        show={showModal}
                                        onHide={handleClose}
                                      >
                                        <Modal.Header closeButton>
                                          <Modal.Title>
                                            User Details ({filledCount}/
                                            {userDetails.length} Filled)
                                          </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                          <Table striped bordered hover>
                                            <thead>
                                              <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {userDetails.map(
                                                (user, index) => (
                                                  <tr key={index}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                      {user.filled
                                                        ? "Filled"
                                                        : "Not Filled"}
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </Table>
                                        </Modal.Body>
                                        <Modal.Footer>
                                          <Button
                                            variant="secondary"
                                            onClick={handleClose}
                                          >
                                            Close
                                          </Button>
                                        </Modal.Footer>
                                      </Modal>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" align="center">
                              No meetings available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <MeetingSummary key={meetings.length} meetings={meetings} />
                </>
              </div>
            </div>
          </div>
        </div>
        {showAlert && (
          <CustomAlert
            message={alertMessage}
            type={alertType}
            onClose={handleCloseAlert}
            onConfirm={confirmationAction}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingList;
