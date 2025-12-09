// src/components/Meetings.js
import './meetings.css';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEvent } from './EventDetailsContext';
import EventName from "./EventName";
const Meetings = () => {
  const location = useLocation();
  const { eventDetails, setEventDetails } = useEvent();

  useEffect(() => {
    if (location.state?.event) {
      setEventDetails(location.state.event);
    }
  }, [location.state, setEventDetails]);

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
    <div className="col-md-12 text-center mb-3">
    <div class="form-check-inline">
      <label class="form-check-label" for="radio1">
      <input type="radio" name="" class="form-check-input" />
        Create Individual Meetings and Send invite to Organizers
      </label>
    </div>
    <div class="form-check-inline">
      <label class="form-check-label" for="radio2">
        <input type="radio" name="" class="form-check-input" />Fill Summary for Meetings
      </label>
    </div>
</div>
</div>

<div className="row">
    <div className="col-md-12">
<div className="TableWrp MeetingBoxWrp mb-3">
<div><button class="btn AddEventBtn mb-2"> Add Metting</button></div>
<table className="table Meetingtable">
                   
                        <tr>
                          <th align="center"><input type="checkbox" name="" class="form-check-input mrgn4px" /></th>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Date</th>                          
                          <th>Action</th>
                        </tr>
                            <tr>
                              <td align="center"><input type="checkbox" name="" class="form-check-input" /> </td>
                              <td>text</td>
                              <td>text</td>
                              <td>text</td>                           
                              <td><button className="btn edit-button">View</button></td>
                            </tr>
                            <tr>
                              <td align="center"><input type="checkbox" name="" class="form-check-input" /> </td>
                              <td>text</td>
                              <td>text</td>
                              <td>text</td>                           
                              <td><button className="btn edit-button">View</button></td>
                            </tr>
                            <tr>
                              <td align="center"><input type="checkbox" name="" class="form-check-input" /> </td>
                              <td>text</td>
                              <td>text</td>
                              <td>text</td>                           
                              <td><button className="btn edit-button">View</button></td>
                            </tr>
                            <tr>
                              <td align="center"><input type="checkbox" name="" class="form-check-input" /> </td>
                              <td>text</td>
                              <td>text</td>
                              <td>text</td>                           
                              <td><button className="btn edit-button">View</button></td>
                            </tr>
                            <tr>
                              <td align="center"><input type="checkbox" name="" class="form-check-input" /> </td>
                              <td>text</td>
                              <td>text</td>
                              <td>text</td>                           
                              <td><button className="btn edit-button">View</button></td>
                            </tr>
                    </table>
</div>


<div className="row">

  <div className="col-md-12">
<div className="MeetingBoxWrp mb-3">
<div className="row">
  <div className="col-md-12">
    <h3 className="rowTitle">Summary</h3>
    <hr></hr>
     </div>

<div className="col-md-12 mb-3">
  <div className="MeetingBoxWrp">
  <h3 className="rowTitle">Online Meetings</h3>
<div className="row">
<div className="col-md-4">
<div class="form-group">
  <label for="usr">No. of Online Meeting conducted</label>
  <input type="text" class="form-control" id="usr" />
</div>
</div>
<div className="col-md-4">
<div class="form-group">
  <label for="usr">Total Duration of Online meetings</label>
  <input type="text" class="form-control" id="usr" />
</div>
</div>
<div className="col-md-4">
<div class="form-group">
  <label for="usr">Average No. of Organizers attending the Meeting</label>
  <input type="text" class="form-control" id="usr" />
</div>
</div>
</div>

  </div>
</div>

<div className="col-md-12">
  <div className="MeetingBoxWrp">
  <h3 className="rowTitle">Offline Meetings</h3>
<div className="row">
<div className="col-md-4">
<div class="form-group">
  <label for="usr">No. of Offline Meeting conducted</label>
  <input type="text" class="form-control" id="usr" />
</div>
</div>
</div>
<div className="row">
<div className="col-md-12">
<div className="TableWrp mb-3">
<h3 className="rowTitle">Travel Information</h3>
<hr></hr>
<table className="table Meetingtable">
                   
                        <tr>
                          <th>Mode of Transport</th>
                          <th>Type of Transport</th>
                          <th>Number of people</th>
                          <th>Average Distance Travelled</th>                          
                          <th>Unit</th>
                        </tr>
                            <tr>
                              <td>Car</td>
                              <td>Petrol</td>
                              <td>2</td>
                              <td>12Km</td>                           
                              <td>km/miles</td>
                            </tr>
                            <tr>
                              <td>Car</td>
                              <td>Petrol</td>
                              <td>2</td>
                              <td>12Km</td>                           
                              <td>km/miles</td>
                            </tr>
                            <tr>
                              <td>Car</td>
                              <td>Petrol</td>
                              <td>2</td>
                              <td>12Km</td>                           
                              <td>km/miles</td>
                            </tr>
                            <tr>
                              <td>Car</td>
                              <td>Petrol</td>
                              <td>2</td>
                              <td>12Km</td>                           
                              <td>km/miles</td>
                            </tr>
                            <tr>
                              <td>Car</td>
                              <td>Petrol</td>
                              <td>2</td>
                              <td>12Km</td>                           
                              <td>km/miles</td>
                            </tr>
                            
                    </table>
</div>

</div>
</div>

<div className="row">

<div className="col-md-6">

<div className="TableWrp">
<h3 className="rowTitle">Stay Information</h3>
<hr></hr>
<table className="table Meetingtable">
                   
                        <tr>                          
                          <th>Type of Hotel</th>
                          <th>Number of people staying</th>
                          
                        </tr>
                            <tr>                              
                              <td>3-Star</td>
                              <td></td> 
                            </tr>
                            <tr>                              
                              <td>4-Star</td>
                              <td></td> 
                            </tr>
                            <tr>                              
                              <td>5-Star</td>
                              <td></td> 
                            </tr>
                            
                    </table>
</div>

</div>

<div className="col-md-6">

<div className="TableWrp">
<h3 className="rowTitle">Meals</h3>
<hr></hr>
<table className="table Meetingtable">
                   
                        <tr>
                          
                          <th>Provided in the Meetings</th>
                          <th>Total number served</th>
                          
                        </tr>
                            <tr>
                              <td>Breakfast</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>Lunch</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>High-Tea</td>
                              <td></td>
                            </tr>
                            
                            
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








</div>
</div>
             </div>
         </div>
     </div>
      
    </div>
  );
};

export default Meetings;
