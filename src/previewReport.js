
import React,  { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js';
import { Chart } from 'chart.js';

import TravelModeDoughnutChart from './AttendeeTravelChart';
import MealConsumptionDoughnutChart from './attendeeMealChart';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { height, width } from "@fortawesome/free-solid-svg-icons/fa0";
import { clear } from "@testing-library/user-event/dist/clear";
import { color } from 'chart.js/helpers';
import { faBorderStyle } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const previewReportStyles = {
  
  previewReportButton: {
    backgroundColor: '#007272',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'center',
    display: 'inline-block',
    textDecoration: 'none',
    marginLeft:'5px',
    
  },
  previewReportButtonHover: {
    backgroundColor: '#016666',
  },
  
  
  
};
 
const PreviewReport = ({eventDetails, sproutImg, coolLogo, handleImageUpload, 
  preEventData, duringEventData, postEventData, uploadedLogo,
  totalEstimatedCarbonEmission,  attendeeTravelConsumptions = [],
  attendeeMealConsumptions = [], attendeeDetails = [], emissionsData,
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,highlight1, highlight2, highlight3, highlight4,
  textContent1,textContent2,textContent3,textContent4,textContent5,textContent6 }) => {

   
    const travelModeMappings = {
      1: 'Car - Diesel',
      2: 'Car - Petrol',
      3: 'Car - CNG',
      4: 'Car - Electric',
      5: 'Bus - Fuel-Based',
      6: 'Train',
      7: 'Bus - Electric',
      8: 'Flight - Economy',
      13: 'Flight - Business',
    };
    const mealMapping = {
      6: 'Veg',
      7: 'Non-Veg',
      8: 'Vegan',
    };
     // Extract labels (emission types) and data (cumulative values) from preEventData
  const preEventlabels = Object.keys(preEventData).map(key => preEventData[key].emissionType);
  const preEventdataValues = Object.keys(preEventData).map(key => preEventData[key].cumulativevalue); 

  const preEventChartData = {
    labels: preEventlabels,
    datasets: [
      {
        data: preEventdataValues,
        backgroundColor: ['#007272', '#7CC97B', '#3379AB', '#12B6B6'],
        hoverBackgroundColor: ['#48AD7F', '#48AD7F', '#48AD7F', '#48AD7F'],
      },
    ],
  };

  
     // Prepare data for during-event chart
     const duringEventChartData = {
      labels: Object.keys(duringEventData).map(key => duringEventData[key].emissionType),
      datasets: [
        {
          data: Object.keys(duringEventData).map(key => duringEventData[key].cumulativevalue),
          backgroundColor: ['#007272', '#7CC97B', '#3379AB', '#12B6B6'],
        hoverBackgroundColor: ['#48AD7F', '#48AD7F', '#48AD7F', '#48AD7F'],
        },
      ],
    };
 // Prepare data for the chart
 const postEventChartData = {
  labels: Object.keys(postEventData).map(key => postEventData[key].emissionType),
  datasets: [
    {
      data: Object.keys(postEventData).map(key => postEventData[key].cumulativevalue),
      backgroundColor: ['#007272', '#7CC97B', '#3379AB', '#12B6B6'],
        hoverBackgroundColor: ['#48AD7F', '#48AD7F', '#48AD7F', '#48AD7F'],
    },
  ],
};
// Map the travelModeId to travelMode names and extract data
const travelModeLabels = attendeeTravelConsumptions.map(consumption => 
  travelModeMappings[consumption.travelModeId] || "Unknown"
);

const travelModeData = attendeeTravelConsumptions.map(consumption => 
  consumption.attendeeCount
);

const travelModeChartData = {
  labels: travelModeLabels,
  datasets: [
    {
      data: travelModeData,
      backgroundColor: [
        '#007272',
        '#7CC97B',
        '#3379AB',
        '#12B6B6',
        '#48AD7F',
        '#A9DFBF',
        '#2E8B57',
        '#3CB371',
        '#228B22',
        '#6B8E23'
      ],
      borderColor: [
        '#007272',
        '#7CC97B',
        '#3379AB',
        '#12B6B6',
        '#48AD7F',
        '#A9DFBF',
        '#2E8B57',
        '#3CB371',
        '#228B22',
        '#6B8E23'
      ],
    },
  ],
};
const mealLabels = (attendeeMealConsumptions || []).map(consumption => mealMapping[consumption.mealId] || `Meal ${consumption.mealId}`);
const mealData = (attendeeMealConsumptions || []).map(consumption => consumption.attendeeCount);

const mealChartData = {
  labels: mealLabels,
  datasets: [
    {
      data: mealData,
      backgroundColor: ['#007272', '#7CC97B', '#3379AB', '#12B6B6', '#48AD7F'],
      hoverBackgroundColor: ['#007272', '#7CC97B', '#3379AB', '#12B6B6', '#48AD7F'],
    },
  ],
};

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'left',
      },
      tooltip: {
        enabled: true,
      }
    }
  };

  const generateHTML = () => {
    return (
      <div class="container">
      <div class="row">  
      <div class="col-md-12">    
               
          <div class="BannerHeader">
          <img src={require('./assets/home-pic.jpg')} alt="Carbon Footprint Report" />        
            <div class="BannerHeader_txt">
              <h2>CARBON <br />FOOTPRINT <br />REPORT</h2>
              {uploadedLogo && (
                  <img 
                    src={uploadedLogo} 
                    alt="Event Logo" 
                    style={{
                      width: '170px', 
                      height: '170px', 
                      objectFit: 'contain',
                      marginTop: '20px',  // Margin added at the top
                      marginBottom: '20px'
                    }}
                  />
                )}
              <h2>{eventDetails.eventName || "Event Name"}</h2>
              <p>HOST ORGANIZATION: {eventDetails.createdBy || "N/A"}</p>
              <p>EVENT DATE: {eventDetails.startDate} to {eventDetails.endDate}</p>
              <p>EVENT: {eventDetails.eventType || "N/A"}</p>
              <p>LOCATION: {eventDetails.location || "N/A"}</p>
            </div>
              
              
            </div>
          </div>
          
        </div>
        <div class="row">
    <div class="col-md-12">
    <div class="PageTitleLogo">
            <div class="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
            <div class="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
           <div class="clearfix"></div>
            </div>
</div>
</div>
<div className="row">
    <div className="col-md-12">
    <div className="GreenBoxTitle"> PURPOSE OF THE ASSESSMENT </div>
    <div className="mainTxt">
    <p>The purpose of this assessment is to calculate the environmental impact of {eventDetails.eventName || "Event Name"}, {eventDetails.location || "N/A"} held on {eventDetails.startDate} to {eventDetails.endDate} at {eventDetails.location || "N/A"} by evaluating its carbon footprint. Through this process, we aim to promote sustainability by identifying opportunities to reduce greenhouse gas emissions and enhance environmental stewardship within event management practices. </p>

<p>The purpose of this report is to calculate the carbon footprint and establish a baseline that can serve as a reference for future events to reduce their carbon footprint. </p>
      </div>
</div>
</div>      

<div className="row">
<div className="col-md-12">
<div className="GreenBoxTitle"> ABOUT THE EVENT </div>
<div className="mainTxt">

<p>{eventDetails.eventName || "Event Name"} was designed with sustainability as a core focus, aiming to minimize its environmental impact while maximizing the positive outcomes for attendees. Through careful planning, we incorporated eco-friendly practices at every stage, from transportation and venue selection to catering and waste management. The organizing team was committed to reduce the event's carbon footprint and calculate the total impact of event on environment, and we are proud to present the calculated carbon emissions as part of our effort to promote transparency and continual improvement in sustainability practices.</p>
</div>
</div>
</div>         
<div className="row">
<div className="col-md-12">
<div className="PageTitleLogo">
<div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
<div className="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
<div className="clearfix"></div>
</div>
</div>
</div>
<div className="row">
<div className="col-md-12">
<div className="GreenBoxTitle">  </div>
<div className="mainTxt">
{image1 ? (
                <img
                  src={image1}
                  alt="Uploaded Image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <p>No image uploaded yet.</p>  /* This is optional: You can remove this line if you don't want any placeholder text */
              )}

</div>
</div>
</div>            
<div className="row">
<div className="col-md-12">
<div className="GreenBoxTitle"> EVENT HIGHLIGHTS </div>
<div className="mainTxt">

  <div className="GreenBox">
  <ul>
  <li>
    <input 
      type="text" 
      className="inputField" 
   
      value={`Event Date - ${eventDetails.startDate} to ${eventDetails.endDate}`}
      readOnly
    />
  </li>
  <li>
    <input 
      type="text" 
      className="inputField" 
      value={`Total Attendees Participants: ${eventDetails.participantCount}`} 
      readOnly
    />
  </li>
  <li>
    <input 
      type="text" 
      className="inputField" 
      value={`Number of hotel rooms booked: ${eventDetails.hotelRoomsBooked || 'N/A'} Room Booked for Guests`} 
      readOnly
    />
  </li>
  <li>
  <input 
      type="text" 
      className="inputField editableField"
      value={highlight1}
    />
  </li>
  <li>
    <input 
      type="text" 
      className="inputField" 
      value={highlight2}
    />
  </li>
  <li>
    <input 
      type="text" 
      className="inputField" 
      value={highlight3} 
    />
  </li>
  <li>
    <input 
      type="text" 
      className="inputField" 
      value={highlight4}
    />
  </li>
</ul>

  </div>


</div>
</div>
</div> 
            
<div className="row">
<div className="col-md-12">
<div className="PageTitleLogo">
<div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
<div className="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
<div className="clearfix"></div>
</div>
</div>
</div>        
        
         
         
  <div className="row">
    <div className="col-md-6">
      <div className="ImgWrp"> 
      
      {image2 ? (
                <img
                  src={image2}
                  alt="Uploaded Image"
                  style={{
                    width: '450px',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <p>No image uploaded yet.</p>  /* This is optional: You can remove this line if you don't want any placeholder text */
              )}
        <div className="textWrp" >
        <input 
          type="text"
          value={textContent1}  
          style={{
            width: '100%',
            padding: '5px',
            border: 'none',
            backgroundColor: 'transparent',
            textAlign: 'center',
            color:'#fff'
          }}
        />
        </div>
      </div>
    </div>
    <div className="col-md-6">
      <div className="ImgWrp"> 
      {image3 ? (
                <img
                  src={image3}
                  alt="Uploaded Image"
                  style={{
                    width: '450px',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <p>No image uploaded yet.</p>  /* This is optional: You can remove this line if you don't want any placeholder text */
              )}
        <div className="textWrp">
        <input 
          type="text"
          value={textContent2}  
          style={{
            width: '100%',
            padding: '5px',
            border: 'none',
            backgroundColor: 'transparent',
            textAlign: 'center',
            color:'#fff'
          }}
        />
        </div>
      </div>
    </div>
    <div className="clearfix"></div>

    <div className="col-md-6">
      <div className="ImgWrp"> 
      {image4 ? (
                <img
                  src={image4}
                  alt="Uploaded Image"
                  style={{
                    width: '450px',
                    height: '300px',
                    objectFit: 'cover',
                  }}  
                />
              ) : (
                <p>No image uploaded yet.</p>  /* This is optional: You can remove this line if you don't want any placeholder text */
              )}
        <div className="textWrp">
        <input 
          type="text"
          value={textContent3}  
          style={{
            width: '100%',
            padding: '5px',
            border: 'none',
            backgroundColor: 'transparent',
            textAlign: 'center',
            color:'#fff'
          }}
        />
        </div>
      </div>
    </div>
    <div className="col-md-6">
      <div className="ImgWrp"> 
      {image5 ? (
                <img
                  src={image5}
                  alt="Uploaded Image"
                  style={{
                    width: '450px',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <p>No image uploaded yet.</p>  /* This is optional: You can remove this line if you don't want any placeholder text */
              )}
        <div className="textWrp">
        <input 
          type="text"
          value={textContent4}  
          style={{
            width: '100%',
            padding: '5px',
            border: 'none',
            backgroundColor: 'transparent',
            textAlign: 'center',
            color:'#fff'
          }}
        />
        </div>
      </div>
    </div>
    <div className="clearfix"></div>

    <div className="col-md-6">
      <div className="ImgWrp" > 
      {image6 ? (
                <img
                  src={image6}
                  alt="Uploaded Image"
                  style={{
                    width: '450px',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <p>No image uploaded yet.</p>  /* This is optional: You can remove this line if you don't want any placeholder text */
              )}
        <div className="textWrp" >
        <input 
          type="text"
          value={textContent5}  
          style={{
            width: '100%',
            padding: '5px',
            border: 'none',
            backgroundColor: 'transparent',
            textAlign: 'center',
            color:'#fff'
          }}
        />
        </div>
      </div>
    </div>
    <div className="col-md-6">
      <div className="ImgWrp"> 
      {image7 ? (
                <img
                  src={image7}
                  alt="Uploaded Image"
                  style={{
                    width: '450px',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <p>No image uploaded yet.</p>  /* This is optional: You can remove this line if you don't want any placeholder text */
              )}
        <div className="textWrp">
        <input 
          type="text"
          value={textContent6}  
          style={{
            width: '100%',
            padding: '5px',
            border: 'none',
            backgroundColor: 'transparent',
            textAlign: 'center',
            color:'#fff'
          }}
        />
        </div>
      </div>
    </div>
    <div className="clearfix"></div>
  </div>


          
        
  <div className="row">
<div className="col-md-12">
<div className="PageTitleLogo">
<div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
<div className="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
<div className="clearfix"></div>
</div>
</div>
</div>

<div className="row">
<div claclassNamess="col-md-12">
<div class="GreenBoxTitle"> METHODOLOGY </div>
<div className="mainTxt">
        <p>Calculating  the carbon footprint of an event involves assessing all activities related to  the event that contribute to greenhouse gas emissions. This includes direct  emissions from energy consumption at the venue, indirect emissions from  attendee and staff  travel,  accommodation, and waste management, as well as emissions from the production  and disposal of materials used. Data on energy usage, transportation distances,  waste generated, and other relevant factors are collected and multiplied by  appropriate emission factors to convert them into carbon dioxide equivalents  (CO2e). The total emissions from all sources are then aggregated to determine  the event's overall carbon footprint. This information can be used to identify  the largest sources of emissions, report on the environmental impact, and  explore options for offsetting or reducing the event's carbon footprint.</p>
        <p>For  better understanding all activities has been divided in the Pre-Event, During  Event and Post Event section so that monitoring of data and calculation became  easy. This methodology enhanced the boundary of event as it includes emissions  associated with pre-event planning also. </p>
      </div>
</div>
</div> 


<div className="row">
<div className="col-md-12">
<div className="GreenBoxTitle"> CARBON EMISSION HEADS </div>
</div>
</div> 
          
      
<div className="row">
<div className="col-md-4">
  <div className="PreEvent">
  <div className="title">Pre Event</div>
			 <div>
			   <ul>
			     <li>Marketing & Invitation Mails</li>
             <li>Printed Invitation</li>
             <li>Printed Marketing Materials </li>
		       </ul>
			 </div>

  </div>

			 </div>

       <div className="col-md-4">
       <div className="DuringEvent">
       <div className="title">During Event</div>
			 <div>
			   <ul>
			     <li>Attendee Travel, Accommodation & Meals</li>
             <li>Energy Consumption</li>
             <li>Snacks & Drinks</li>
             <li>Material Consumption</li>
		       </ul>
			 </div>
    
</div>
				 
			 </div>


       <div className="col-md-4">
       <div className="PostEvent">

       <div className="title">Post Event</div>
			 <div>
			   <ul>
			     <li>Quantity of Waste Generated</li>
             
		       </ul>
			 </div>
</div>
       
			 </div>

       
        </div>
    

  
        <div className="row">
<div className="col-md-12">
<div className="PageTitleLogo">
<div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
<div className="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
<div className="clearfix"></div>
</div>
</div>
</div>



<div className="row">
<div className="col-md-12">
<table className="table table-bordered">
      <thead>
        <tr>
          <th valign="top" bgcolor="#007272"><strong>Activities</strong></th>
          <th valign="top" bgcolor="#007272"><strong>Emissions (kgCO2e)</strong></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan="2" valign="top" style={{background: '#B9CDE5'}}><strong>Pre Event</strong></td>
        </tr>
        {preEventData.map((item, index) => (
          <tr key={index}>
            <td>{item.emissionType}</td>
            <td>{item.cumulativevalue.toFixed(2)}</td>
          </tr>
        ))}

        <tr>
          <td colSpan="2" valign="top" style={{background: '#B9CDE5'}}><strong>During Event</strong></td>
        </tr>
        {duringEventData.map((item, index) => (
          <tr key={index}>
            <td valign="top">{item.emissionType}</td>
            <td valign="top">{item.cumulativevalue.toFixed(2)}</td>
          </tr>
        ))}

        <tr>
          <td colSpan="2"  valign="top" bgcolor="#B9CDE5"><strong>Post Event</strong></td>
        </tr>
        {postEventData.map((item, index) => (
          <tr key={index}>
            <td valign="top">{item.emissionType}</td>
            <td valign="top">{item.cumulativevalue.toFixed(2)}</td>
          </tr>
        ))}

<tr>
          <td rowspan="2" align="left" valign="baseline" bgcolor="#DDD9C3"><strong>Total Emission from CoOL Conclave</strong></td>
          <td valign="top" bgcolor="#DDD9C3"><strong>{totalEstimatedCarbonEmission ? totalEstimatedCarbonEmission.toFixed(2) : 'Loading...'}</strong></td>
        </tr>
        <tr>
          <td valign="top" bgcolor="#DDD9C3"> <strong>{totalEstimatedCarbonEmission ? (totalEstimatedCarbonEmission / 1000).toFixed(2) + ' tCO2e' : 'Loading...'}</strong></td>
        </tr>
      </tbody>
    </table>
<div className="mainTxt">


</div>
</div>
</div> 
      
<div className="row">
<div className="col-md-12">
<div className="mainTxt">

<p><strong>BOUNDARIES:</strong></p>
        <p><span class="blueClr">event</span> duration  (days),  attendees( number )</p>
        <p><span class="blueClr">travel: </span> guest, participants and organizers travel by mode (air, private vehicle, public transport) and distance.</p>
        <p><span class="blueClr">accommodation: </span>accommodation:  hotel nights for guests, build crew or stand staffing.</p>
        <p><span class="blueClr">catering: </span> includes number of meals ( non-vegetarian, vegetarian, vegan ) consumed by guests, crew, build staff for duration of event.</p>
        <p><span class="blueClr">energy:</span>  actual consumption as estimated or measured by venue (kWh)</p>
        {eventDetails.boundary === "Material Consumption" && (
            <p><span className="blueClr">materials: </span> printed matter, plastics, recyclable materials and other materials used in stand build &amp; deliver</p>
          )}
        {eventDetails.boundary === "Material Consumption" && (
            <p><span class="blueClr">transportation:</span>  transported weight of infrastructure, AV, materials, furniture and other  stand-based items, distance and mode of transportation.</p>
            
          )}
        <p><span class="blueClr">waste:</span>  recyclable and residual waste</p>
</div>
</div>
</div> 
<div className="row">
<div className="col-md-12">
<div className="PageTitleLogo">
<div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
<div className="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
<div className="clearfix"></div>
</div>
</div>
</div>   
       
<div className="row">
<div className="col-md-6">
<div className="card">
<div className="chart-container">
          <canvas id="pre-event-chart"></canvas>
        </div>
</div>



</div>

<div className="col-md-6">

      <table className="table table-bordered">
          <thead>
            <tr>
           
              <th valign="top" bgcolor="#007272">Emission Type</th>
              <th valign="top" bgcolor="#007272">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(preEventData).map((key, index) => (
              <tr key={index}>
             
                <td>{preEventData[key].emissionType}</td> 
                <td>{preEventData[key].cumulativevalue}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      
</div>
</div> 
	
<div className="row">
<div className="col-md-12">
<div className="PageTitleLogo">
<div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
<div className="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
<div className="clearfix"></div>
</div>
</div>
</div>

<div className="row">
<div className="col-md-6">
<div className="card">
<div className="chart-container">
              <canvas id="during-event-chart"></canvas>
            </div>
</div>
        
          
        
</div>
<div className="col-md-6">

<div className="table-section">
          <table className="table table-bordered">
              <thead>
                <tr>
            
                  <th valign="top" bgcolor="#007272">Emission Type</th>
                  <th valign="top" bgcolor="#007272">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(duringEventData).map((key, index) => (
                  <tr key={index}>
              
                    <td>{duringEventData[key].emissionType}</td> 
                    <td>{duringEventData[key].cumulativevalue}</td> 
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
</div>
</div> 

<div className="row">
<div className="col-md-12">
<div className="PageTitleLogo">
<div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
<div className="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
<div className="clearfix"></div>
</div>
</div>
</div>
	
	<div className="row">
    <div className="col-md-6">    
    <div className="card">
    <div className="chart-container">
          <canvas id="post-event-chart"></canvas>
        </div>
</div>
  
    </div>
    <div className="col-md-6">
    <div className="table-section">
      <table className="table table-bordered">
          <thead>
            <tr>
              
              <th valign="top" bgcolor="#007272">Emission Type</th>
              <th valign="top" bgcolor="#007272">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(postEventData).map((key, index) => (
              <tr key={index}>
              
                <td>{postEventData[key].emissionType}</td> 
                <td>{postEventData[key].cumulativevalue}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
	<div className="row">
<div className="col-md-12">
<div className="PageTitleLogo">
<div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
<div className="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
<div className="clearfix"></div>
</div>
</div>
</div>

	<div className="row">
    <div className="col-md-6">
    <div className="card">
    <div className="chart-container">
          <canvas id="travel-mode-chart"></canvas>
        </div>
</div>
     
    </div>
    <div className="col-md-6">
    <div className="table-section">
          <table className="table table-bordered">
          <thead>
            <tr>
              <th valign="top" bgcolor="#007272">Travel Mode</th>
              <th valign="top" bgcolor="#007272">Attendee Count</th>
            </tr>
          </thead>
          <tbody>
            {attendeeTravelConsumptions && attendeeTravelConsumptions.length > 0 ? (
              attendeeTravelConsumptions.map((consumption) => {
                const mode = travelModeMappings[consumption.travelModeId] || "Unknown";
                return (
                  <tr key={consumption.attendeeTravelConsumptionId}>
                    <td>{mode}</td>
                    <td>{consumption.attendeeCount}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="2">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div className="row">
<div className="col-md-12">
<div className="PageTitleLogo">
<div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
<div className="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
<div className="clearfix"></div>
</div>
</div>
</div>

  <div className="row">
    <div className="col-md-6">
    <div className="card">
    <div className="chart-container">
        <canvas id="meal-chart"></canvas>
      </div>
</div>
    
    </div>
    <div className="col-md-6">
    <div class="table-section">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th valign="top" bgcolor="#007272">Meal Type</th>
              <th valign="top" bgcolor="#007272">Attendee Count</th>
            </tr>
          </thead>
          <tbody>
            {attendeeMealConsumptions && attendeeMealConsumptions.length > 0 ? (
              attendeeMealConsumptions.map((consumption) => {
                const mealType = mealMapping[consumption.mealId] || `Meal ${consumption.mealId}`;
                return (
                  <tr key={consumption.attendeeMealConsumptionId}>
                    <td>{mealType}</td>
                    <td>{consumption.attendeeCount}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="2">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

    </div>
  </div>
  <div className="row mt-4">
<div className="col-md-12">
<div className="GreenBoxTitle"> Emissions Breakdown by Scope and Activity </div>
</div>
</div> 
<div className="row">
<div className="col-md-12">
<div className="mainTxt">

<table className="table table-bordered">
    <thead>
      <tr>
        <th valign="top" bgcolor="#007272">Scope</th>
        <th valign="top" bgcolor="#007272">Activities</th>
        <th  valign="top" bgcolor="#007272">Emissions (kgCO2e)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowSpan="3" valign="top">Scope 1 (Direct Emissions)</td>
        <td valign="top">Invitation Emails</td>
        <td valign="top">{emissionsData.scope1.invitationEmails}</td>
      </tr>
      <tr>
        <td valign="top">Printed Invitations</td>
        <td valign="top">{emissionsData.scope1.printedInvitations}</td>
      </tr>
      <tr>
        <td valign="top">Fuel Consumption in DG Sets and Transportation</td>
        <td valign="top">{emissionsData.scope1.fuelConsumption}</td>
      </tr>
      <tr>
        <td valign="top">Scope 2 (Indirect Emissions)</td>
        <td valign="top">Electricity Consumption</td>
        <td valign="top">{emissionsData.scope2.electricityConsumption}</td>
      </tr>
      <tr>
        <td rowSpan="8" valign="top">Scope 3 (Indirect Emissions)</td>
        <td valign="top">Snacks/Drinks</td>
        <td valign="top">{emissionsData.scope3.snacksDrinks}</td>
      </tr>
      <tr>
        <td valign="top">Material Consumption</td>
        <td valign="top">{emissionsData.scope3.materialConsumption}</td>
      </tr>
      <tr>
        <td valign="top">Attendee Travel</td>
        <td valign="top">{emissionsData.scope3.attendeeTravel}</td>
      </tr>
      <tr>
        <td valign="top">Attendee Accommodation</td>
        <td valign="top">{emissionsData.scope3.attendeeAccommodation}</td>
      </tr>
      <tr>
        <td valign="top">Attendee Meals</td>
        <td valign="top">{emissionsData.scope3.attendeeMeals}</td>
      </tr>
      <tr>
        <td valign="top">Waste Generation</td>
        <td valign="top">{emissionsData.scope3.wasteGeneration}</td>
      </tr>
      <tr>
        <td valign="top">Pre Event Meetings</td>
        <td valign="top">{emissionsData.scope3.preEventMeetings}</td>
      </tr>
      <tr>
        <td valign="top" bgcolor="#DDD9C3"><strong>Total Emission from CoOL Conclave</strong></td>
        <td valign="top" bgcolor="#DDD9C3"><strong>{emissionsData.totalEmission}</strong></td>
      </tr>
    </tbody>
  </table>
</div>
</div>
</div> 

<div className="row">
<div className="col-md-12">
<div className="PageTitleLogo">
<div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
<div className="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Cool Logo" /></div>
<div className="clearfix"></div>
</div>
</div>
</div>

<div className="row">
<div className="col-md-12">
<div className="GreenBoxTitle"> CONCLUSION </div>
<div className="mainTxt">
<p>{eventDetails.eventName || "Event Name"} team has taken significant steps to minimize the event's carbon  footprint, implementing various strategies such as energy-efficient venue  selection, promoting sustainable transportation options, and reducing waste.  Despite these efforts, a total of 153 carbon credits are required to fully  offset the residual emissions from the event. By purchasing these carbon  credits, the team aims to neutralize their environmental impact, supporting  projects that reduce or remove an equivalent amount of greenhouse gases from  the atmosphere. This commitment underscores the event's dedication to  sustainability and decarbonization.</p>

</div>
</div>
</div> 
  
      </div>
      
    );
  };

  const handlePreviewClick = () => {
    // Generate static HTML for the table and the chart container
    const reportHTML = ReactDOMServer.renderToStaticMarkup(generateHTML());
  
    // Open a new window and write the HTML to it
    const newWindow = window.open("", "_blank");
  
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Preview Report</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { font-family: "Montserrat", sans-serif !important; }
          .container {
  width: 1000px !important;
  margin: 0 auto;
  
}
.page1 {
  background: url("../img/home-pic.jpg") left top no-repeat;
}
.logoWrp {
  height: 600px;
  padding-top: 20px;
}
.greenBg {
  background: #29AD76;
  opacity: 0.8;
  color: #ffffff;
  padding-top: 100px;
}
.bigTitle {
  padding: 0px 100px;
  text-align: center;
}
.bigTitle h1 {
  font-size: 30px;
  font-weight: 700;
  line-height: 50px;
}
.greenBg .BottomTxt {
  margin-left: 100px;
  margin-right: 100px;
  padding: 80px 0px;
}
.PageTitleLogo {
  margin: 50px 0px 50px 0px;
}

.BannerHeader {
  position: relative;
  text-align: center;
  color: white;
}


.BannerHeader_txt {
  position: absolute;
  top: 8px;
  right: 16px;
  background: #29AD76;
  opacity: 0.8;
  color: #ffffff;
  padding-top: 100px;
}
.GreenBoxTitle {
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 700;
}
.GreenBoxTitle::before {
  display: block;
  content: '';
  width: 40px;
  height: 30px;
  background: #29AD76;
  position: absolute;
  left: -30px;
}
.page2 {}
.mainTxt {
  font-size: 16px;
  text-align: justify;
  margin: 20px 0px 30px 0px;
}

.mainTxt ul li{
	line-height: 30px;
}
.roungImg {
  border-radius: 10%;
  border: #29AD76 solid 10px;
  margin-bottom: 20px;
}
.GreenBox {
  border-radius: 20%;
  background: #29AD76;
  padding: 50px 0px;
	margin-top: 50px;
}
.GreenBox ul {}
.GreenBox ul li {
  margin-left: 100px;
  padding: 0px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  line-height: 40px;
}

.GreenBox ul li input {
  background: none;
    border: none;
    color: #ffffff;
    width:400px;
}


.ImgWrp {
  position: relative;
  font-family: Arial;
	margin-bottom: 20px;
  border:#dddddd solid 2px;
}

.textWrp {
  position: absolute;
  bottom:35px;
  right: 25px;
  background:#007272;
  color:#ffffff;
  padding: 10px;
	font-size: 14px;
	min-width: 200px;
	text-align: center;
}
.PreEvent, .DuringEvent, .PostEvent{
	background: #DEE7D1;
	min-height: 290px;
	margin-top: 20px;
	padding-bottom: 10px;
}

.PreEvent ul li, .DuringEvent ul li, .PostEvent ul li{
	line-height: 40px;
}

.pull-right {
  float: right;
}
.pull-left {
  float: left;
}

.DuringEvent{
	background: #D2E4E2;
}
.PostEvent{
	background: #D8D3E0;
}
.PreEvent .title, .DuringEvent .title, .PostEvent .title{
	text-align: center;
	font-weight: 700;
	background: #9BBB59;
	padding: 10px 0px;
	color: #ffffff;
	margin-bottom: 20px;
}

.DuringEvent .title{
	background: #5EAFA6;
}
.PostEvent .title{
	background: #8064A2;
}

.table th{
    color: #ffffff!important;
    background:##007272!important;
}
.table th, .table td {
    padding:5px 5px!important;
    vertical-align:middle!important;
    border-top: 1px solid #dee2e6;
}

.blueClr{
	color: #008CC6;
}

#footer{
	color: #ffffff;
background: #29AD76;
padding:20px;
margin-top:20px;
}

#footer td{
padding-right:20px;
}

#footer td:nth-child(2) {
  
border-left:#ffffff solid 1px;
}
          .chart-table-container { display: flex; flex-direction: column; align-items: center; }
          .chart-container { margin: 10px; }
          canvas { width: 200px; height: 200px; }
        </style>
      </head>
      <body>
        <div id="chart-container">${reportHTML}</div>
        <script>
          document.addEventListener('DOMContentLoaded', function () {
            const doughnutOptions = ${JSON.stringify(doughnutOptions)};
            
            // Prepare data for each chart
            const preEventData = ${JSON.stringify(preEventChartData)};
            const duringEventData = ${JSON.stringify(duringEventChartData)};
            const postEventData = ${JSON.stringify(postEventChartData)};
            const travelModeData = ${JSON.stringify(travelModeChartData)};
            const mealData = ${JSON.stringify(mealChartData)};
  
            // Initialize charts
            const preEventCtx = document.getElementById('pre-event-chart').getContext('2d');
            const duringEventCtx = document.getElementById('during-event-chart').getContext('2d');
            const postEventCtx = document.getElementById('post-event-chart').getContext('2d');
            const travelModeCtx = document.getElementById('travel-mode-chart').getContext('2d');
            const mealCtx = document.getElementById('meal-chart').getContext('2d');
  
            new Chart(preEventCtx, {
              type: 'doughnut',
              data: preEventData,
              options: doughnutOptions,
            });
  
            new Chart(duringEventCtx, {
              type: 'doughnut',
              data: duringEventData,
              options: doughnutOptions,
            });
  
            new Chart(postEventCtx, {
              type: 'doughnut',
              data: postEventData,
              options: doughnutOptions,
            });
  
            new Chart(travelModeCtx, {
              type: 'doughnut',
              data: travelModeData,
              options: doughnutOptions,
            });
  
            new Chart(mealCtx, {
              type: 'doughnut',
              data: mealData,
              options: doughnutOptions,
            });
          });
        </script>
      </body>
      </html>
    `);
  
    newWindow.document.close();
  };
  
  const handleDownloadClick = async () => {
    // Create a temporary container to hold the report content
    const reportElement = document.createElement('div');
    document.body.appendChild(reportElement);
  
    // Render the static HTML for the report
    reportElement.innerHTML = ReactDOMServer.renderToStaticMarkup(generateHTML());
  
    // Render the charts to ensure they are visible
    const doughnutOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'left',
        },
        tooltip: {
          enabled: true,
        }
      }
    };
    const chartData = {
      preEvent: preEventChartData,
      duringEvent: duringEventChartData,
      postEvent: postEventChartData,
      travelMode: travelModeChartData,
      meal: mealChartData,
    };
    const chartIds = ['pre-event-chart', 'during-event-chart', 'post-event-chart', 'travel-mode-chart', 'meal-chart'];
  
    // Render charts to canvas
    chartIds.forEach((id, index) => {
      const ctx = document.getElementById(id).getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: chartData[Object.keys(chartData)[index]],
        options: doughnutOptions,
      });
    });
  
    // Wait longer to ensure charts are fully rendered
    await new Promise(resolve => setTimeout(resolve, 1000));  // Extended wait time
  
    // Extract base64 images from charts
    const chartImages = chartIds.map(id => {
      const chartCanvas = document.getElementById(id);
      return chartCanvas.toDataURL('image/png');
    });
  
    // Replace canvas with images
    chartIds.forEach((id, index) => {
      const canvas = document.getElementById(id);
      const img = document.createElement('img');
      img.src = chartImages[index];
      img.style.width = canvas.style.width;
      img.style.height = canvas.style.height;
      canvas.replaceWith(img);
    });
  
    // Generate PDF from the updated HTML
    const opt = {
      margin: 0.5, 
      filename: 'carbon-footprint-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
      },
    };
  
    html2pdf().set(opt).from(reportElement).save().then(() => {
      document.body.removeChild(reportElement);
    });
  };
  
  return (
    <div>
      <div
        style={previewReportStyles.previewReportButton}
        onClick={handlePreviewClick}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = previewReportStyles.previewReportButtonHover.backgroundColor;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = previewReportStyles.previewReportButton.backgroundColor;
        }}
      >
        Preview
      </div>
      {/* <div
        style={previewReportStyles.previewReportButton}
        onClick={handleDownloadClick}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = previewReportStyles.previewReportButtonHover.backgroundColor;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = previewReportStyles.previewReportButton.backgroundColor;
        }}
      >
        Download
      </div> */}
    </div>
  );
};

export default PreviewReport;
