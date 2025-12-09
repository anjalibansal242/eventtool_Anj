import './MeetingSummary.css';
import React, { useState, useEffect } from "react";
import { useEvent } from '../../EventDetailsContext';
import { getMeetingSummary,getTravelModes } from '../../apiService';

const MeetingSummary = ({ meetings }) => {
  // if (!shouldDisplay) return null;
  const { eventDetails } = useEvent();
  const [travelModes, setTravelModes] = useState([]);
  const accommodationTypes = {
    1: "3-star",
    2: "4-star",
    3: "5-star",
    4: "NA"
  };
  const [OnlinemeetingData, setOnlineMeetingData] = useState({
    MeetingCount: 0,
    duration: 0,
    OrganizerCount: 0,
  });
  const [oflinemeetingData, setOfflineMeetingData] = useState({
    MeetingCount: 0,
    attendeeTravelConsumptions: [],
    attendeeAccommodationConsumptions: [],
    attendeeMeals:{}
  });
  useEffect(() => {
    const fetchTravelModes = async () => {
      try {
        const response = await getTravelModes("Individual");
        console.log("Travel Mode", response);
        setTravelModes(response);
      } catch (error) {
        console.error("Error fetching travel modes:", error);
      }
    };

    fetchTravelModes();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!eventDetails) {
          throw new Error("Event details not available");
        }

        const eventId = eventDetails.eventId;

        const data = await getMeetingSummary(eventId);
        setOnlineMeetingData({
          MeetingCount:data.onlineMeetingSummary.totalMeetingCount,
          duration:data.onlineMeetingSummary.totalDuration,
          OrganizerCount:data.onlineMeetingSummary.averageNoOfOrganizers,
        });
        setOfflineMeetingData({
          MeetingCount:
          data.offlineMeetingSummary.totalMeetingCount,
          attendeeTravelConsumptions:
          data.offlineMeetingSummary.attendeeMeetingTravelConsumptions || [],
          attendeeAccommodationConsumptions:
          data.offlineMeetingSummary.attendeeMeetingAccommodationConsumptions || [],
          attendeeMeals:data.offlineMeetingSummary.attendeeMeetingMeals
        });
        console.log('Summary',data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } 
    };

    fetchData();
  }, [eventDetails, meetings]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="MeetingBoxWrp mb-3">
          <div className="row">
            <div className="col-md-12">
              <h3 className="rowTitle">Summary</h3>
              <hr />
            </div>
            <div className="col-md-12 mb-3">
              <div className="MeetingBoxWrp GreenWrp">
                <h3 className="rowTitle">Online Meetings</h3>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="usr">No. of Online Meetings conducted</label>
                      <input type="text" className="form-control" id="usr" value={OnlinemeetingData.MeetingCount}/>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="usr">Total Duration of Online meetings</label>
                      <input type="text" className="form-control" id="usr" value={OnlinemeetingData.duration} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="usr">Total Number of Participants in Online Meeting</label>
                      <input type="text" className="form-control" id="usr" value={OnlinemeetingData.OrganizerCount} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="MeetingBoxWrp WhiteWrp">
                <h3 className="rowTitle">Offline Meetings</h3>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="usr">No. of Offline Meetings conducted</label>
                      <input type="text" className="form-control" id="usr" value={oflinemeetingData.MeetingCount}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="TableWrp mb-3">
                      <h3 className="rowTitle">Travel Information</h3>
                      <hr />
                      <table className="table Meetingtable">
                        <thead>
                          <tr>
                            <th>Mode of Transport</th>
                            <th>Type of Transport</th>
                            <th>Number of people</th>
                            <th>Average Distance Travelled</th>
                            <th>Unit</th>
                          </tr>
                        </thead>
                        <tbody>
                        {oflinemeetingData.attendeeTravelConsumptions && oflinemeetingData.attendeeTravelConsumptions.length > 0 ? (
                        oflinemeetingData.attendeeTravelConsumptions.map((travel, index) => (
                <tr key={index}>
                  <td>
                    {travelModes.find(
                      (mode) => mode.travelModeId === travel.travelModeId
                    )
                      ? travelModes.find(
                          (mode) => mode.travelModeId === travel.travelModeId
                        ).mode
                      : ""}
                  </td>
                  <td>
                    {travelModes.find(
                      (mode) => mode.travelModeId === travel.travelModeId
                    )
                      ? travelModes.find(
                          (mode) => mode.travelModeId === travel.travelModeId
                        ).type
                      : ""}
                  </td>
                  <td>
                  <input type="text" name="attendeeCount" className="form-control" value={travel.attendeeCount}/>
                  </td>
                  <td>
                    <input type="text"
                      name="avgDistance"
                      className="form-control"
                      value={travel.avgDistance}
                    />
                  </td>
                  <td>km/miles</td>
                </tr>
                          ))) : (
                            <div>No data available</div>
                          )}
                          
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="TableWrp">
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
                        {oflinemeetingData.attendeeAccommodationConsumptions && oflinemeetingData.attendeeAccommodationConsumptions.length > 0 ? (
                        oflinemeetingData.attendeeAccommodationConsumptions.map(
            (accommodation, index) => (
              <tr key={index}>
                  <td>{accommodationTypes[accommodation.accommodationId]}</td>
                  <td>{accommodation.attendeeCount}</td>
                </tr>
            )
          )) : (
            <div>No data available</div>
          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="TableWrp">
                      <h3 className="rowTitle">Meals</h3>
                      <hr />
                      <table className="table Meetingtable">
                        <thead>
                          <tr>
                            <th>Provided in the Meetings</th>
                            <th>Total number served</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Breakfast</td>
                            <td>{oflinemeetingData.attendeeMeals.breakfast}</td>
                          </tr>
                          <tr>
                            <td>Dinner</td>
                            <td>{oflinemeetingData.attendeeMeals.dinner}</td>
                          </tr>
                          <tr>
                            <td>HighTea</td>
                            <td>{oflinemeetingData.attendeeMeals.highTea}</td>
                          </tr>
                          <tr>
                            <td>Lunch</td>
                            <td>{oflinemeetingData.attendeeMeals.lunch}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingSummary;
