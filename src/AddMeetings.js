// src/AddMeetings.js
import React from 'react';
// import './AddMeetings.css'; 
import EventName from "./EventName";

const AddMeetings = () => {
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

                 <div className="row mb-3 justify-content-center">
    <div className="col-md-3 text-center">
    <div class="form-group">
  <label>Type of Meeting</label>
  <select class="form-control">
    <option>Online</option>
    <option>Offline</option>    
  </select>
</div>
    
</div>
</div>
<div className="row">
<div className="col-md-12">
<div className="OnlineMeetingWrp mb-3">
  <div className="row">
  <div className="col-md-12">
    <h3 className="rowTitle">Online Meeting</h3>
    <hr></hr>
     </div>
     <div className="col-md-6">
    <div class="form-group">
  <label for="usr">Name</label>
  <input type="text" class="form-control" id="usr" />
</div>
</div>

<div className="col-md-6">
    <div class="form-group">
  <label for="usr">Date of the Meeting</label>
  <input type="date" class="form-control" id="usr" />
</div>
</div>

<div className="col-md-6">
    <div class="form-group">
  <label for="usr">Duration Number of organizers attending</label>
  <select class="form-control" id="sel1">    
    <option>15 mins</option>
    <option>30 mins</option>
    <option>45 mins</option>
    <option>1 hr</option>
    <option>1.5 hrs</option>
    <option>2 hrs</option>
    <option>2.5 hrs</option>
    <option>3 hrs</option>
    <option>3.5 hrs</option>
    <option>4 hrs</option>
    <option>4.5 hrs</option>
    <option>5 hrs</option>
    <option>5.5 hrs</option>
    <option>6 hrs</option>
  </select>
</div>
</div>

<div className="col-md-6">
    <div class="form-group">
  <label for="usr">Number of organizers attending</label>
  <input type="text" class="form-control" id="usr" />
</div>
</div>
  </div>


    


</div>
</div>
</div>

<div className="row">
  <div className="col-md-12">
<div className="OfflineMeetingWrp mb-3">
<div className="row">
  <div className="col-md-12">
    <h3 className="rowTitle">Offline Meeting</h3>
    <hr></hr>
     </div>
<div className="col-md-6">
<div class="form-group">
  <label for="usr">Name</label>
  <input type="text" class="form-control" id="usr" />
</div>
</div>
<div className="col-md-6">
<div class="form-group">
  <label for="usr">Date of the Meeting</label>
  <input type="date" class="form-control" id="usr" />
</div>
</div>
<div className="col-md-6">
<div class="form-group">
  <label for="usr">Location of the Meeting</label>
  <input type="text" class="form-control" id="usr" />
</div>
</div>

<div className="col-md-6">
<label for="usr">Meals Provided</label>
<div class="form-group">
  
<div class="form-check-inline">
      <label class="form-check-label">
        <input type="checkbox" class="form-check-input" />Breakfast
      </label>      
    </div>
    <div class="form-check-inline">
      <label class="form-check-label">
        <input type="checkbox" class="form-check-input" />Lunch
      </label>      
    </div>
    <div class="form-check-inline">
      <label class="form-check-label">
        <input type="checkbox" class="form-check-input" />High-Tea
      </label>      
    </div>
    <div class="form-check-inline">
      <label class="form-check-label">
        <input type="checkbox" class="form-check-input" />Dinner
      </label>      
    </div>
</div>
</div>
<div className="col-md-12">
  <div><img src="src/assets/organizerDetails.jpg"></img></div>
  <div>
    <button className="btn GreenBtnn">Download Template</button>
    <button className="btn GreenBtnn">Upload Spreadsheet</button>   
    <button className="btn GreenBtnn">No file selected</button> 
    <button className="btn GreenBtnn">Send</button>
    </div>
</div>
</div>
  
</div>

  </div>
</div>
    

    <div className="row">
      <div className="col-md-12">
        <div className="OfflineMeetingSummeryWrp">
        
    <h3 className="rowTitle">Offline Meeting Summery</h3>
    <hr></hr>
    
    <div className="row">

    <div className="col-md-4">
<div class="form-group">
  <label for="usr">Name</label>
  <input type="text" class="form-control" id="usr" />
</div>
</div>
<div className="col-md-4">
<div class="form-group">
  <label for="usr">Date of the Meeting</label>
  <input type="date" class="form-control" id="usr" />
</div>
</div>
<div className="col-md-4">
<div class="form-group">
  <label for="usr">Location of the Meeting</label>
  <input type="text" class="form-control" id="usr" />
</div>
</div>
<div className="col-md-4">
  <div className="form-group">
<label>Percentage of Data filled by the organizers</label>
<input type="text" class="form-control" id="usr" />
  </div>
</div>
<div className="col-md-4">
<label for="usr">Meals Provided</label>
<div class="form-group">
  
<div class="form-check-inline">
      <label class="form-check-label">
        <input type="checkbox" class="form-check-input" />Breakfast
      </label>      
    </div>
    <div class="form-check-inline">
      <label class="form-check-label">
        <input type="checkbox" class="form-check-input" />Lunch
      </label>      
    </div>
    <div class="form-check-inline">
      <label class="form-check-label">
        <input type="checkbox" class="form-check-input" />High-Tea
      </label>      
    </div>
    <div class="form-check-inline">
      <label class="form-check-label">
        <input type="checkbox" class="form-check-input" />Dinner
      </label>      
    </div>
</div>
</div>
    </div>
          <div className="row">
            <div className="col-md-8">
            <p><strong>Travel Information</strong></p>
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
                         <td>Diesel</td>
                         <td>2</td>
                         <td>12Km</td>                           
                         <td>km/miles</td>
                       </tr>
                       <tr>
                         <td>Car</td>
                         <td>CNG</td>
                         <td>2</td>
                         <td>12Km</td>                           
                         <td>km/miles</td>
                       </tr>
                       <tr>
                         <td>Car</td>
                         <td>EV</td>
                         <td>2</td>
                         <td>12Km</td>                           
                         <td>km/miles</td>
                       </tr>
                       <tr>
                         <td>Car</td>
                         <td>Fuel-based</td>
                         <td>2</td>
                         <td>12Km</td>                           
                         <td>km/miles</td>
                       </tr>
                       
               </table>
              
            </div>

            <div className="col-md-4">
            <p><strong>Travel Information</strong></p>
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
        </div>
      </div>
    </div>
             </div>
         </div>
     </div>
      
    </div>
  );
};

export default AddMeetings;
