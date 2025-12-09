import './MeetingInfo.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventName from "../../EventName";
import { useEvent } from "../../EventDetailsContext";
import { getIsMeetingAvailable } from "../../apiService";

const MeetingInfo = () => {
  const { eventDetails } = useEvent();
  const [showSummary, setShowSummary] = useState(null);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState();


  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === 'create') {
      navigate('/events/pre-event-planning/add-meetings');
    } else if (e.target.value === 'summary') {
      navigate('/events/pre-event-planning/upload-meeting-summary'); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!eventDetails) {
          throw new Error("Event details not available");
        }

        const eventId = eventDetails.eventId;

        const data = await getIsMeetingAvailable(eventId);
        setShowSummary(data.isMeetingAvailable);
      } catch (error) {
        console.error("Error fetching data:", error);
        setShowSummary(false);
      }
    };

    fetchData();
  }, [eventDetails]);

  useEffect(() => {
    if (showSummary) {
      navigate('/events/pre-event-planning/meeting-list');
    }
  }, [showSummary, navigate]);
  

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
            {showSummary ? null : (
              <div>
                
                {!selectedOption && (
                  <div className="row">
                  <div className="col-md-12 text-center mb-3">
                    <div className="form-check-inline">
                      <label className="form-check-label" htmlFor="radio1">
                        <input
                          type="radio"
                          name="meetingOption"
                          className="form-check-input"
                          value="create"
                          checked={selectedOption === 'create'}
                          onChange={handleOptionChange}
                        />
                        Create Individual Meetings and Send invite to Organizers
                      </label>
                    </div>
                    <div className="form-check-inline">
                      <label className="form-check-label" htmlFor="radio2">
                        <input
                          type="radio"
                          name="meetingOption"
                          className="form-check-input"
                          value="summary"
                          checked={selectedOption === 'summary'}
                          onChange={handleOptionChange}
                        />
                        Fill Summary for Meetings
                      </label>
                    </div>
                  </div>
                </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingInfo;
