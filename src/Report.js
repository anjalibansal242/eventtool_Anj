import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import EcoIndex from './EcoIndex';
import EventDetailsSidebar from "./eventDetailsSidebar";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useEvent } from "./EventDetailsContext";
import "./Report.css";
import EventName from "./EventName";
import PreviewReport from './previewReport';
import {
  getEmissionPreEventActivity,
  getEmissionDuringEventActivity,
  getEmissionPostEventActivity,
  getDashboardData,
  isAttendeeDetailsInitiated,
  GetEnergyConsumptionList
} from './apiService';
import homePic from './assets/home-pic.jpg';
import sproutImg from './assets/sprout.png';
import DoughnutChart from './DoughnutChart';
import DoughnutChart2 from './DoughnutChart2';
import DoughnutChart3 from "./DoughnutChart3";
import TravelModeDoughnutChart from './AttendeeTravelChart';
import MealConsumptionDoughnutChart from './attendeeMealChart';
import CustomAlert from "./CustomAlert"; 
import { width } from "@fortawesome/free-solid-svg-icons/fa0";


const Report = () => {

  const location = useLocation();
  const { eventDetails, setEventDetails } = useEvent();
  const [preEventData, setPreEventData] = useState([]);
  const [duringEventData, setDuringEventData] = useState([]);
  const [postEventData, setPostEventData] = useState([]);
  const [totalEstimatedCarbonEmission, setTotalEstimatedCarbonEmission] = useState(null);
  const [attendeeDetails, setAttendeeDetails] = useState([]);
  const [energyConsumptionData, setEnergyConsumptionData] = useState([]);
  const [wasteGeneration, setWasteGeneration] = useState('0.00');
  const [detailedData, setDetailedData] = useState([]);
  const reportRef1 = useRef();
  const reportRef2 = useRef();
  const reportRef3 = useRef();
  const reportRef4 = useRef();
  const reportRef5 = useRef();
  const reportRef6 = useRef();
  const reportRef7 = useRef();
  const reportRef8 = useRef();
  const reportRef9 = useRef();
  const reportRef10 = useRef();
  const reportRef11 = useRef();
  const reportRef12 = useRef();
  const reportRef13 = useRef();
  const reportRef14 = useRef();
  const reportRef15 = useRef();
  const reportRef16 = useRef();
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    if (location.state?.event) {
      setEventDetails(location.state.event);
      console.log("eventDetails: ",eventDetails);
    }
  }, [location.state, setEventDetails, eventDetails.eventId]);
  console.log("eventDetails: ",eventDetails);

  const handleDownloadPDF = () => {
    const refs = [
      reportRef1, reportRef2, reportRef3, reportRef4, reportRef5, reportRef6, 
      reportRef7, reportRef8, reportRef9, reportRef10, reportRef11, reportRef12, 
      reportRef13, reportRef14, reportRef15, reportRef16
    ];
  
    const noPdfElements = document.querySelectorAll('.no-pdf');
    
    // Hide elements with the "no-pdf" class from the PDF
    noPdfElements.forEach(el => el.style.display = 'none');
  
    const pdf = new jsPDF('p', 'mm', 'a4');
  
    // Function to increase font size for specific elements, excluding those with the "no-font-size-change" class
    const increaseFontSize = (ref) => {
      // Select all elements (p, span, td, th, tr) but exclude ones with the "no-font-size-change" class
      const elements = ref.querySelectorAll(
        "p:not(.no-font-size-change):not(.no-pdf), span:not(.no-font-size-change):not(.no-pdf), td:not(.no-font-size-change):not(.no-pdf), th:not(.no-font-size-change):not(.no-pdf), tr:not(.no-font-size-change):not(.no-pdf), i:not(.no-pdf)"
      );
      
      elements.forEach(element => {
        const currentFontSize = window.getComputedStyle(element).fontSize;
        const newSize = parseFloat(currentFontSize) * 1.5 + "px"; // Increase font size by 1.5x
        element.style.fontSize = newSize;
      });
    };
  
    const generatePDF = (index = 0) => {
      if (index >= refs.length) {
        noPdfElements.forEach(el => el.style.display = ''); // Restore visibility of hidden elements
        pdf.save('report.pdf'); // Save the final PDF
        return;
      }
  
      const ref = refs[index].current;
  
      if (ref) {
        increaseFontSize(ref); // Increase font size dynamically for selected elements
  
        html2canvas(ref, { backgroundColor: '#ffffff', scale: 1 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
          if (index !== 0) {
            pdf.addPage();
          }
  
          // Apply margins for all pages except pages 3 and 4 (index 2 and 3)
          if (index === 0 || index === 2 || index === 3) {
            // No margin for page 3 and 4
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          } else {
            // Apply top-bottom margin of 10mm and left-right margin of 5mm
            const topMargin = 20;
            const bottomMargin = 20;
            const leftMargin = 10;
            const rightMargin = 10;
            const adjustedPdfWidth = pdfWidth - (leftMargin + rightMargin); // Adjust width for margins
            const adjustedPdfHeight = pdfHeight - (topMargin + bottomMargin); // Adjust height for margins
  
            pdf.addImage(imgData, 'PNG', leftMargin, topMargin, adjustedPdfWidth, adjustedPdfHeight);
          }
  
          generatePDF(index + 1);
        });
      } else {
        generatePDF(index + 1);
      }
    };
  
    generatePDF(); // Start generating the PDF
  };
  
  
  useEffect(() => {
    const fetchEmissionData = async () => {
      try {
       
        const preEventResponse = await getEmissionPreEventActivity(eventDetails.eventId);
        setPreEventData(preEventResponse.mainData);
  
        const duringEventResponse = await getEmissionDuringEventActivity(eventDetails.eventId);
    
      const flattenedData = duringEventResponse.detailedData.flatMap(item => 
        item.data.map(subItem => ({
          emissionType: item.emissionType,
          emissionSubcategory: subItem.emissionSubcategory,
          value: subItem.value
        }))
      );

      setDuringEventData(duringEventResponse.mainData);
      setDetailedData(flattenedData); 
       
        const postEventResponse = await getEmissionPostEventActivity(eventDetails.eventId);
        setPostEventData(postEventResponse.mainData);
        
      if (postEventResponse && postEventResponse.mainData) {
      
        const totalWasteEmission = postEventResponse.mainData.reduce((acc, item) => {
         
          const value = parseFloat(item.value) || 0;
          return acc + value;
        }, 0);

        setWasteGeneration(totalWasteEmission.toFixed(2));
      }
        
        const dashboardResponse = await getDashboardData(eventDetails.eventId);
        setTotalEstimatedCarbonEmission(dashboardResponse.totalEstimatedCarbonEmission);
  
        const attendeeResponse = await isAttendeeDetailsInitiated(eventDetails.eventId);
        console.log("Full Attendee Response:", attendeeResponse);
  
        if (attendeeResponse && attendeeResponse.attendee) {
          setAttendeeDetails(attendeeResponse.attendee); 
          console.log("Attendee Details:", attendeeResponse.attendee);
        } else {
          console.log("No Attendee Details found.");
        }
      
      const energyConsumptionResponse = await GetEnergyConsumptionList(eventDetails.eventId);
      setEnergyConsumptionData(energyConsumptionResponse); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    };
  
    fetchEmissionData();
  }, [eventDetails.eventId]);

  const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [image5, setImage5] = useState(null);
    const [image6, setImage6] = useState(null);
    const [image7, setImage7] = useState(null);
    const [uploadedLogo, setUploadedLogo] = useState(null);
    const [textContent1, setTextContent1] = useState('');
    const [textContent2, setTextContent2] = useState('');
    const [textContent3, setTextContent3] = useState('');
    const [textContent4, setTextContent4] = useState('');
    const [textContent5, setTextContent5] = useState('');
    const [textContent6, setTextContent6] = useState('');
    const [highlight1, setHighlight1] = useState('');
    const [highlight2, setHighlight2] = useState('');
    const [highlight3, setHighlight3] = useState('');
    const [highlight4, setHighlight4] = useState('');


    const handleLogoUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Check the file size (in bytes)
        if (file.size > 500 * 1024) { // 500 KB
          setAlertMessage("File size exceeds 500 KB. Please upload a smaller image.");
          setAlertType("success");
          setShowAlert(true);
          return; // Exit the function if the file is too large
        }
    
        const img = new Image();
        const reader = new FileReader();
    
        reader.onload = function (e) {
          img.src = e.target.result;
        };
    
        img.onload = function () {
          const width = img.naturalWidth;  // Check the actual pixel width
          const height = img.naturalHeight; 
    
          if (width <= 170 && height <= 170) {
            // Valid logo size, proceed with the upload
            setUploadedLogo(img.src); // Update state with the uploaded image URL
          } else {
            setAlertMessage("Logo size exceeds 170x170 pixels. Please upload a smaller image.");
            setAlertType("success");
            setShowAlert(true);
          }
        };
    
        reader.readAsDataURL(file);
      }
    };
   
    const handleImageUpload1 = (event) => {
      const file = event.target.files[0];
  
      if (file) {
        if (file.size > 500 * 1024) { // 500 KB
          setAlertMessage("File size exceeds 500 KB. Please upload a smaller image.");
          setAlertType("success");
          setShowAlert(true);
          event.target.value = ''; // Reset input field
          return; // Exit the function if the file is too large
        }
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImage1(reader.result); // Set the image preview
        };
  
        reader.readAsDataURL(file);
      }
  
      // Reset input field so user can select the same image again
      event.target.value = '';
    };
    
    const handleImageUpload2 = (event) => {
      const file = event.target.files[0];
  
      if (file) {
        if (file.size > 500 * 1024) { // 500 KB
          setAlertMessage("File size exceeds 500 KB. Please upload a smaller image.");
          setAlertType("success");
          setShowAlert(true);
          event.target.value = ''; // Reset input field
          return; // Exit the function if the file is too large
        }
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImage2(reader.result); // Set the image preview
        };
  
        reader.readAsDataURL(file);
      }
  
      // Reset input field so user can select the same image again
      event.target.value = '';
    };
  
    const handleImageUpload3 = (event) => {
      const file = event.target.files[0];
  
      if (file) {
        if (file.size > 500 * 1024) { // 500 KB
          setAlertMessage("File size exceeds 500 KB. Please upload a smaller image.");
          setAlertType("success");
          setShowAlert(true);
          event.target.value = ''; // Reset input field
          return; // Exit the function if the file is too large
        }
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImage3(reader.result); // Set the image preview
        };
  
        reader.readAsDataURL(file);
      }
  
      // Reset input field so user can select the same image again
      event.target.value = '';
    };
    const handleImageUpload4 = (event) => {
      const file = event.target.files[0];
  
      if (file) {
        if (file.size > 500 * 1024) { // 500 KB
          setAlertMessage("File size exceeds 500 KB. Please upload a smaller image.");
          setAlertType("success");
          setShowAlert(true);
          event.target.value = ''; // Reset input field
          return; // Exit the function if the file is too large
        }
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImage4(reader.result); // Set the image preview
        };
  
        reader.readAsDataURL(file);
      }
  
      // Reset input field so user can select the same image again
      event.target.value = '';
    };
    const handleImageUpload5 = (event) => {
      const file = event.target.files[0];
  
      if (file) {
        if (file.size > 500 * 1024) { // 500 KB
          setAlertMessage("File size exceeds 500 KB. Please upload a smaller image.");
          setAlertType("success");
          setShowAlert(true);
          event.target.value = ''; // Reset input field
          return; // Exit the function if the file is too large
        }
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImage5(reader.result); // Set the image preview
        };
  
        reader.readAsDataURL(file);
      }
  
      // Reset input field so user can select the same image again
      event.target.value = '';
    };
    const handleImageUpload6 = (event) => {
      const file = event.target.files[0];
  
      if (file) {
        if (file.size > 500 * 1024) { // 500 KB
          setAlertMessage("File size exceeds 500 KB. Please upload a smaller image.");
          setAlertType("success");
          setShowAlert(true);
          event.target.value = ''; // Reset input field
          return; // Exit the function if the file is too large
        }
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImage6(reader.result); // Set the image preview
        };
  
        reader.readAsDataURL(file);
      }
  
      // Reset input field so user can select the same image again
      event.target.value = '';
    };
 const handleImageUpload7 = (event) => {
      const file = event.target.files[0];
  
      if (file) {
        if (file.size > 500 * 1024) { // 500 KB
          setAlertMessage("File size exceeds 500 KB. Please upload a smaller image.");
          setAlertType("success");
          setShowAlert(true);
          event.target.value = ''; // Reset input field
          return; // Exit the function if the file is too large
        }
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImage7(reader.result); // Set the image preview
        };
  
        reader.readAsDataURL(file);
      }
  
      // Reset input field so user can select the same image again
      event.target.value = '';
    };

  const filteredData = preEventData.filter(item => 
    item.emissionType === "Invitation Emails" || item.emissionType === "Printed Invitations" || item.emissionType === "Meeting"
  );
  // Extract the quantity for "Fuel Consumption (Diesel)"
  const fuelConsumption = energyConsumptionData.find(item => item.energyName === 'Fuel Consumption (Diesel)');
  const fuelConsumptionQuantity = fuelConsumption ? fuelConsumption.quantity.toFixed(2) : '0.00';

  const electricityConsumption = energyConsumptionData.find(item => item.energyName === 'Electricity Consumption');
  const electricityConsumptionQuantity = electricityConsumption ? electricityConsumption.quantity.toFixed(2) : '0.00';
 // Extract values from duringEventData
 const snacksDrinks = duringEventData.find(item => item.emissionType === 'Meals');
 const snacksDrinksQuantity = snacksDrinks ? snacksDrinks.cumulativevalue.toFixed(2) : '0.00';

 const materialConsumption = duringEventData.find(item => item.emissionType === 'Material Consumption');
 const materialConsumptionQuantity = materialConsumption ? materialConsumption.cumulativevalue.toFixed(2) : '0.00';
  

 const getEmissionValue = (subcategory) => {
  //console.log("Available Subcategories:", detailedData.map(item => item.emissionSubcategory)); // Log to check
  const dataItem = detailedData.find(item => item.emissionSubcategory === subcategory);
  return dataItem ? dataItem.value.toFixed(2) : '0.00';
};
const emissionsData = {
  scope1: {
    invitationEmails: filteredData.find(item => item.emissionType === "Invitation Emails")?.cumulativevalue.toFixed(2) || '0.00',
    printedInvitations: filteredData.find(item => item.emissionType === "Printed Invitations")?.cumulativevalue.toFixed(2) || '0.00',
    fuelConsumption: fuelConsumptionQuantity,
  },
  scope2: {
    electricityConsumption: electricityConsumptionQuantity,
  },
  scope3: {
    snacksDrinks: snacksDrinksQuantity,
    materialConsumption: materialConsumptionQuantity,
    attendeeTravel: getEmissionValue("Attendee travel"),
    attendeeAccommodation: getEmissionValue("Attendee Accommodation"),
    attendeeMeals: getEmissionValue("Attendee Meal"),
    wasteGeneration: wasteGeneration,
    preEventMeetings: filteredData.find(item => item.emissionType === "Meeting")?.cumulativevalue.toFixed(2) || '0.00',
  },
  totalEmission: totalEstimatedCarbonEmission ? totalEstimatedCarbonEmission.toFixed(2) : 'Loading...',
};

const formatLocation = (location) => {
  if (!location) return "N/A, N/A, N/A";
  
  // Assuming format is "Venue, City, State, Pincode"
  const parts = location.split(',');
  const venue = parts[0]?.trim() || "N/A";
  const city = parts[1]?.trim() || "N/A";
  const state = parts[2]?.trim() || "N/A";
  
  return `${venue}, ${city}, ${state}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A"; 
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formattedStartDate = formatDate(eventDetails.startDate);
const formattedEndDate = formatDate(eventDetails.endDate);

const handleCloseAlert = () => {
  setShowAlert(false);
 
};
console.log("event details boundary : ",eventDetails.boundary);

//console.log("pre event data : ",preEventData);
  return (
    <div className="report-container">
      <EcoIndex />
      <div className="main-content">
        <EventDetailsSidebar eventDetails={eventDetails} />
        <div className="container-fluid" >
      <div className="row">
         <div className="col-md-12">
             <div className="White_Box">
              <div className="row">
                <div className="col-md-12">
                <EventName />
                </div>
              </div>
            <div className="row" ref={reportRef1} >
            <div className="col-md-12">
          <div className="left_container" >
          <div className="carbon-footprint-image" alt="Carbon Footprint Report">
            <div className="left_container_Txt">
              <h1>CARBON <br /> FOOTPRINT <br /> REPORT</h1>

              {/* Container for upload box and i-icon */}
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '80px', marginBottom: '150px' }}>
                
                {/* Image upload box */}
                <div style={{ position: 'relative', width: '170px', height: '170px' }}>
                  {/* Display the uploaded image or upload label */}
                  {uploadedLogo ? (
                    <img
                      src={uploadedLogo}
                      alt="Uploaded Logo"
                      style={{
                        width: '170px',
                        height: '170px',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <label
                      htmlFor="logoUpload"
                      style={{
                        display: 'inline-block',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f9f9f9cc',
                        textAlign: 'center',
                        lineHeight: '50px',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '80px',
                          transform: 'translateY(-50%)',
                        }}
                      >
                        Upload Logo
                      </span>
                    </label>
                  )}

                  {/* Invisible file input overlay */}
                  <input
                    type="file"
                    id="logoUpload"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                    onChange={handleLogoUpload}
                    accept="image/*"
                  />
                </div>

                {/* i-icon tooltip on the right */}
                <span className="tooltip-icon no-pdf" style={{ marginLeft: '5px', cursor: 'pointer', marginTop:'-172px' }}>
                  <i
                    className="fa fa-info-circle"
                    aria-hidden="true"
                    style={{ color: 'white' }}
                  />
                  <span className="tooltip-text" style={{width: '220px'}}>
                  Image file should be of 170 * 170pixels and file size should be less than 500kb.
                  </span>
                </span>
              </div>



              <h2>{eventDetails.eventName || "Event Name"}</h2>
              <p>EVENT DATE: {eventDetails.startDate} to {eventDetails.endDate}</p>
              <p>EVENT: {eventDetails.eventType || "N/A"}</p>
              <p>LOCATION:{formatLocation(eventDetails.location)}</p>
            </div>
            </div>
          </div>
          
</div>
</div>     
                    
        <div className="row page-break" ref={reportRef2}>
          <div className="col-md-12">
            <div className="PageTitleLogo">
              <div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
              <div className="pull-right"><img src={uploadedLogo} width="70" height="70" alt="Cool Logo" /></div>
              <div className="clearfix"></div>
            </div>
            <div className="GreenBoxTitle"> PURPOSE OF THE ASSESSMENT </div>
            <div className="mainTxt">
              <p>The purpose of this assessment is to calculate the environmental impact of {eventDetails.eventName || "Event Name"}, held on {eventDetails.startDate} to {eventDetails.endDate} at {formatLocation(eventDetails.location)} by evaluating its carbon footprint. Through this process, we aim to promote sustainability by identifying opportunities to reduce greenhouse gas emissions and enhance environmental stewardship within event management practices. </p>
              <p>The purpose of this report is to calculate the carbon footprint and establish a baseline that can serve as a reference for future events to reduce their carbon footprint. </p>
            </div>
            <div className="GreenBoxTitle"> ABOUT THE EVENT </div>
            <div className="mainTxt">
              <p>{eventDetails.eventName || "Event Name"} was designed with sustainability as a core focus, aiming to minimize its environmental impact while maximizing the positive outcomes for attendees. Through careful planning, we incorporated eco-friendly practices at every stage, from transportation and venue selection to catering and waste management. The organizing team was committed to reduce the event's carbon footprint and calculate the total impact of event on environment, and we are proud to present the calculated carbon emissions as part of our effort to promote transparency and continual improvement in sustainability practices.</p>
              
            </div>
          </div>
        </div>
        <div className="row page-break" ref={reportRef3}>
          <div className="col-md-12">
            <div className="PageTitleLogo">
              <div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
              <div className="pull-right"><img src={uploadedLogo} width="70" height="70" alt="Cool Logo" /></div>
              <div className="clearfix"></div>
            </div>
            <div className={`ImgWrp1 ${image1 ? 'no-background' : ''}`}>
                {image1 ? (
                  <img
                    src={image1}
                    alt="Preview 1"
                    
                  />
                ) : (
                  <label
                    htmlFor="imageUpload1"
                    style={{
                      display: 'inline-block',
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#f9f9f9cc',
                      textAlign: 'center',
                      lineHeight: '50px',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        transform: 'translateY(-50%)',
                        marginTop: '300px',
                      }}
                    >
                      Upload photo for carbon emission report
                    </span>
                  </label>
                )}

                {/* Invisible file input overlay */}
                <input
                  type="file"
                  id="imageUpload1"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                  onChange={handleImageUpload1} // Handle file change
                  accept="image/*"
                />
              </div>
                      
            <div className="GreenBoxTitle" > EVENT HIGHLIGHTS<span className="tooltip-icon no-pdf">
                              <i
                                className="fa fa-info-circle"
                                aria-hidden="true"
                              />
                              <span className="tooltip-text">
                              You can take the example of below given Highlights and write your own : 
                              <br /> 1. 15 Category of Awards 
                              <br /> 2. Cultural & Musical Events
                              <br /> 3. Decarbonization Theme
                              <br /> 4. 398 Room Booked for Guests
                              </span>
                            </span></div>
  
            <div className="GreenBox" >
              <ul>
                <li > 
                  <input 
                    type="text" 
                    className="inputField readOnlyField"
                    value={`Event Date - ${formattedStartDate} to ${formattedEndDate}`}
                    readOnly
                  />
                </li>
                <li>
                  <input 
                    type="text" 
                    className="inputField readOnlyField"
                    value={`Total Attendees Participants: ${eventDetails.participantCount}`} 
                    readOnly
                  />
                </li>
                <li>
                  <input 
                    type="text" 
                    className="inputField readOnlyField"
                    value={`Number of hotel rooms booked: ${eventDetails.roomsBooked || 'N/A'} Rooms Booked for Guests`} 
                    readOnly
                  />
                </li>
                <li>
                  <input 
                    type="text" 
                    className={`inputField editableField ${highlight1 ? 'no-border' : ''}`}
                    placeholder="---Add Highlight---" 
                    value={highlight1}
                    onChange={(e) => setHighlight1(e.target.value)}
                  />
                </li>
                <li>
                  <input 
                    type="text" 
                    className={`inputField editableField ${highlight2 ? 'no-border' : ''}`}
                    placeholder="---Add Highlight---" 
                    value={highlight2}
                    onChange={(e) => setHighlight2(e.target.value)}
                  />
                </li>
                <li>
                  <input 
                    type="text" 
                    className={`inputField editableField ${highlight3 ? 'no-border' : ''}`}
                    placeholder="---Add Highlight---" 
                    value={highlight3}
                    onChange={(e) => setHighlight3(e.target.value)}
                  />
                </li>
                <li>
                  <input 
                    type="text" 
                    className={`inputField editableField ${highlight4 ? 'no-border' : ''}`}
                    placeholder="---Add Highlight---" 
                    value={highlight4}
                    onChange={(e) => setHighlight4(e.target.value)}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      
        <div className="row page-break" ref={reportRef4}>
          <div className="col-md-12">
            <div className="PageTitleLogo">
              <div className="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
              <div className="pull-right"><img src={uploadedLogo} width="70" height="70" alt="Cool Logo" /></div>
              <div className="clearfix"></div>
            </div>
            <div class="GreenBoxTitle"> IMAGES OF EMISSION REDUCTION STRATEGIES</div>
            <div class="mainTxt">
  <div class="row">
    <div class="col-md-6">
    <div className={`ImgWrp ${image2 ? 'no-background' : ''}`} >
      {image2 ? (
        <img
          src={image2}
          alt="Preview 2"
        />
      ) : (
        <label
          htmlFor="imageUpload2" 
        >
          <span
            style={{
              display: 'inline-block',
              transform: 'translateY(-50%)',
              marginTop: '10px',
            }}
          >
            Upload Picture for Sustainability Measure 1
          </span>
        </label>
      )}

      {/* Invisible file input overlay */}
      <input
        type="file"
        id="imageUpload2"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
        }}
        onChange={handleImageUpload2} 
        accept="image/*"
      />

      {/* Text input */}
      <div className="textWrp" >
        <input
          type="text"
          placeholder="---Add Title---"
          // value={textContent1}
          onChange={(e) => setTextContent1(e.target.value)}
          className="editableText"
          style={{
            width: '100%',
            padding: '5px',
            border: '1px solid #ccc',
            color: 'white', // Set text color to white
            backgroundColor: 'transparent',
          }}
        />
      </div>
    </div>
    </div>
    <div class="col-md-6">
    <div className={`ImgWrp ${image3 ? 'no-background' : ''}`} >
      {image3 ? (
        <img
          src={image3}
          alt="Preview 2"
          
        />
      ) : (
        <label
          htmlFor="imageUpload3"
          
        >
          <span
            style={{
              display: 'inline-block',
              transform: 'translateY(-50%)',
              marginTop: '10px',
            }}
          >
            Upload Picture for Sustainability Measure 2
          </span>
        </label>
      )}

      {/* Invisible file input overlay */}
      <input
        type="file"
        id="imageUpload3"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
        }}
        onChange={handleImageUpload3} 
        accept="image/*"
      />

      {/* Text input */}
      <div className="textWrp" >
        <input
          type="text"
          placeholder="---Add Title---"
          // value={textContent2}
          onChange={(e) => setTextContent2(e.target.value)}
          className="editableText"
          style={{
            width: '100%',
            padding: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>
    </div>
    </div>
    <div class="clearfix"></div>

    <div class="col-md-6">
    <div className={`ImgWrp ${image4 ? 'no-background' : ''}`}>
      {image4 ? (
        <img
          src={image4}
          alt="Preview 4"
         
        />
      ) : (
        <label
          htmlFor="imageUpload4"
          
        >
          <span
            style={{
              display: 'inline-block',
              transform: 'translateY(-50%)',
              marginTop: '22px',
            }}
          >
            Upload Picture for Sustainability Measure 3
          </span>
        </label>
      )}

      {/* Invisible file input overlay */}
      <input
        type="file"
        id="imageUpload4"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
        }}
        onChange={handleImageUpload4} // Handle file change
        accept="image/*"
      />

      {/* Text input */}
      <div className="textWrp" >
        <input
          type="text"
          placeholder="---Add Title---"
          // value={textContent3}
          onChange={(e) => setTextContent3(e.target.value)}
          className="editableText"
          style={{
            width: '100%',
            padding: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>
    </div>
    </div>
    <div class="col-md-6">
      <div className={`ImgWrp ${image5 ? 'no-background' : ''}`} >
      {image5 ? (
        <img
          src={image5}
          alt="Preview 5"
         
        />
      ) : (
        <label
          htmlFor="imageUpload5"
         
        >
          <span
           
          >
            Upload Picture for Sustainability Measure 4
          </span>
        </label>
      )}

      {/* Invisible file input overlay */}
      <input
        type="file"
        id="imageUpload5"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
        }}
        onChange={handleImageUpload5} // Handle file change
        accept="image/*"
      />

      {/* Text input */}
      <div className="textWrp">
        <input
          type="text"
          placeholder="---Add Title---"
          // value={textContent4}
          onChange={(e) => setTextContent4(e.target.value)}
          className="editableText"
          style={{
            width: '100%',
            padding: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>
    </div>
    </div>
    <div class="clearfix"></div>

    <div class="col-md-6">
    <div className={`ImgWrp ${image6 ? 'no-background' : ''}`}>
      {image6 ? (
        <img
          src={image6}
          alt="Preview 6"
          
        />
      ) : (
        <label
          htmlFor="imageUpload6"
          
        >
          <span
            
          >
            Upload Picture for Sustainability Measure 5
          </span>
        </label>
      )}

      {/* Invisible file input overlay */}
      <input
        type="file"
        id="imageUpload6"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
        }}
        onChange={handleImageUpload6} // Handle file change
        accept="image/*"
      />

      {/* Text input */}
      <div className="textWrp" style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="---Add Title---"
          // value={textContent5}
          onChange={(e) => setTextContent5(e.target.value)}
          className="editableText"
          
        />
      </div>
    </div>
    </div>
    <div class="col-md-6">
    <div className={`ImgWrp ${image7 ? 'no-background' : ''}`}>
      {image7 ? (
        <img
          src={image7}
          alt="Preview 7"
         
        />
      ) : (
        <label
          htmlFor="imageUpload7"
          
        >
          <span
           
          >
            Upload Picture for Sustainability Measure 6
          </span>
        </label>
      )}

      {/* Invisible file input overlay */}
      <input
        type="file"
        id="imageUpload7"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
        }}
        onChange={handleImageUpload7} // Handle file change
        accept="image/*"
      />

      {/* Text input */}
      <div className="textWrp" >
        <input
          type="text"
          placeholder="---Add Title---"
          // value={textContent6}
          onChange={(e) => setTextContent6(e.target.value)}
          className="editableText"
          
        />
      </div>
    </div>
    </div>
    <div class="clearfix"></div>
  </div>
</div>

          </div>
        </div>


  <div class="row page-break" ref={reportRef5}>
    <div class="col-md-12">
      <div class="PageTitleLogo">
        <div class="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
        <div class="pull-right"><img src={uploadedLogo} width="70" height="70" alt="Sprout" /></div>
        <div class="clearfix"></div>
      </div>
      <div class="GreenBoxTitle"> METHODOLOGY </div>
      <div class="mainTxt">
        <p>Calculating  the carbon footprint of an event involves assessing all activities related to  the event that contribute to greenhouse gas emissions. This includes direct  emissions from energy consumption at the venue, indirect emissions from  attendee and staff  travel,  accommodation, and waste management, as well as emissions from the production  and disposal of materials used. Data on energy usage, transportation distances,  waste generated, and other relevant factors are collected and multiplied by  appropriate emission factors to convert them into carbon dioxide equivalents  (CO2e). The total emissions from all sources are then aggregated to determine  the event's overall carbon footprint. This information can be used to identify  the largest sources of emissions, report on the environmental impact, and  explore options for offsetting or reducing the event's carbon footprint.</p>
        <p>For  better understanding all activities has been divided in the Pre-Event, During  Event and Post Event section so that monitoring of data and calculation became  easy. This methodology enhanced the boundary of event as it includes emissions  associated with pre-event planning also. </p>
      </div>
      <br /><br /><br />
      <div class="GreenBoxTitle"> CARBON EMISSION HEADS </div>
      <div class="row">
		 <div class="col-md-4">
			 <div class="PreEvent">
				 <div class="title">Pre Event</div>
			 <div>
			   <ul>
			     <li>
			       Marketing & Invitation Mails		         </li>
			     <li>Printed Invitation		         </li>
			     <li>Printed Marketing Materials </li>
		       </ul>
			 </div>
			 </div>
		  
	    </div> 
		  
		  <div class="col-md-4">
			  <div class="DuringEvent">
				  <div class="title">During Event</div>
			 <div>
			   <ul>
			     <li>Attendee Travel, Accommodation &amp; Meals</li>
			     <li>Energy Consumption</li>
			     <li>Snacks &amp; Drinks</li>
			     <li>Material Consumption</li>
		       </ul>
			 </div>
			  </div>
		  
	    </div> 
		  
		  <div class="col-md-4">
			  <div class="PostEvent">
				  <div class="title">Post Event</div>
			 <div>
			   <ul>
			     <li>Quantity of Waste Generated</li>
		       </ul>
			 </div>
			  </div>
		  
	    </div> 
		  
        </div>
    </div>
  </div>
  <div class="row page-break" ref={reportRef6}>
    <div class="col-md-12">
      <div class="PageTitleLogo">
        <div class="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
        <div class="pull-right"><img src={uploadedLogo} width="70" height="70" alt="Sprout" /></div>
        <div class="clearfix"></div>
      </div>
      <div class="mainTxt">
      <table className="table table-bordered">
      <thead>
        <tr>
          <th valign="top" bgcolor="#007272"><strong>Activities</strong></th>
          <th valign="top" bgcolor="#007272"><strong>Emissions (kgCO2e)</strong></th>
        </tr>
      </thead>
      <tbody>
        <tr>
        <td colSpan="2" align="center" valign="top" bgcolor="#B9CDE5"><strong>Pre Event</strong></td>
        </tr>
        {preEventData.map((item, index) => (
          <tr key={index}>
            <td valign="top">{item.emissionType}</td>
            <td valign="top">{item.cumulativevalue.toFixed(2)}</td>
          </tr>
        ))}

        <tr>
          <td colSpan="2" align="center" valign="top" bgcolor="#B9CDE5"><strong>During Event</strong></td>
        </tr>
        {duringEventData.map((item, index) => (
          <tr key={index}>
            <td valign="top">{item.emissionType}</td>
            <td valign="top">{item.cumulativevalue.toFixed(2)}</td>
          </tr>
        ))}

        <tr>
          <td colSpan="2" align="center" valign="top" bgcolor="#B9CDE5"><strong>Post Event</strong></td>
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

      </div>
      <div class="mainTxt">
      <p style={{ fontSize: '18px' }}><strong>BOUNDARIES:</strong></p>
      <p className="no-font-size-change" style={{ fontSize: '14px' }}>
        <span className="blueClr" style={{ fontSize: '18px', fontWeight: 'bold' }}>event:</span> 
        <span className="event-duration" style={{ color: '#555', marginLeft: '5px', fontSize: '15px' }}>
          duration (days), attendees (number)
        </span>
      </p>
      <p className="no-font-size-change" style={{ fontSize: '14px' }}>
        <span className="blueClr" style={{ fontSize: '18px', fontWeight: 'bold' }}>travel: </span>
        <span className="travel-details" style={{ color: '#555', marginLeft: '5px', fontSize: '15px' }}>
          guest, participants, and organizers travel by mode (air, private vehicle, public transport) and distance.
        </span>
      </p>
      <p className="no-font-size-change" style={{ fontSize: '14px' }}>
        <span className="blueClr" style={{ fontSize: '18px', fontWeight: 'bold' }}>accommodation: </span> 
        <span className="travel-details" style={{ color: '#555', marginLeft: '5px', fontSize: '15px' }}>hotel nights for guests, build crew, or stand staffing.</span>
      </p>
      <p className="no-font-size-change" style={{ fontSize: '14px' }}>
        <span className="blueClr" style={{ fontSize: '18px', fontWeight: 'bold' }}>catering: </span> 
        <span className="travel-details" style={{ color: '#555', marginLeft: '5px', fontSize: '15px' }}>includes number of meals (non-vegetarian, vegetarian, vegan) consumed by guests, crew, and build staff for the duration of the event.</span>
      </p>
      <p className="no-font-size-change" style={{ fontSize: '14px' }}>
        <span className="blueClr" style={{ fontSize: '18px', fontWeight: 'bold' }}>energy:</span> 
        <span className="travel-details" style={{ color: '#555', marginLeft: '5px', fontSize: '15px' }}>actual consumption as estimated or measured by venue (kWh)</span>
      </p>
      {eventDetails.boundary.includes("Material Consumption") && (
        <p className="no-font-size-change" style={{ fontSize: '14px' }}>
          <span className="blueClr" style={{ fontSize: '18px', fontWeight: 'bold' }}>materials: </span> 
          <span className="travel-details" style={{ color: '#555', marginLeft: '5px', fontSize: '15px' }}>
            printed matter, plastics, recyclable materials, and other materials used in stand build &amp; delivery.
          </span>
        </p>
      )}
      {eventDetails.boundary.includes("Material Consumption") && (
        <p className="no-font-size-change" style={{ fontSize: '14px' }}>
          <span className="blueClr" style={{ fontSize: '18px', fontWeight: 'bold' }}>transportation: </span> 
          <span className="travel-details" style={{ color: '#555', marginLeft: '5px', fontSize: '15px' }}>
            transported weight of infrastructure, AV, materials, furniture, and other stand-based items, distance, and mode of transportation.
          </span>
        </p>
      )}


      <p className="no-font-size-change" style={{ fontSize: '14px' }}>
        <span className="blueClr" style={{ fontSize: '18px', fontWeight: 'bold' }}>waste:</span> 
        <span className="travel-details" style={{ color: '#555', marginLeft: '5px', fontSize: '15px' }}>recyclable and residual waste</span>
      </p>



      </div>
    </div>
  </div>
  <div class="row page-break" ref={reportRef7}>
    <div class="col-md-12">
      <div class="PageTitleLogo">
        <div class="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
        <div class="pull-right"><img src={uploadedLogo} width="70" height="70" alt="Sprout" /></div>
        <div class="clearfix"></div>
      </div>
      <div class="mainTxt">
      <div className="chart-table-container">
      <div
          className="chart-section"
          style={{ border: 'none !important', boxShadow: 'none !important' }}
        >
        <DoughnutChart eventId={eventDetails.eventId} />
      </div>

      <div className="table-section">
        <table>
          <thead>
            <tr>
           
              <th>Emission Type</th>
              <th>Value</th>
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
      </div>
      
    </div>
 
	
	<div class="row page-break" >
    <div class="col-md-12">
      <div class="PageTitleLogo">
        {/* <div class="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div> */}
        {/* <div class="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Sprout" /></div> */}
        <div class="clearfix"></div>
      </div>
      <div class="mainTxt">
        
      <div className="chart-table-container" >
      <div
        // className="chart-section"
        style={{ border: 'none', boxShadow: 'none', marginLeft:'20px' }}
      >
        <DoughnutChart2 eventId={eventDetails.eventId} />
      </div>
      <div className="table-section" >
        <table style={{width: '80%',tableLayout:'fixed'}}>
          <thead style={{width: '70%'}}>
            <tr>
        
              <th>Emission Type</th>
              <th>Value</th>
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
      
    </div>
  </div>
  </div>
	
	<div class="row page-break" ref={reportRef9}>
    <div class="col-md-12">
      <div class="PageTitleLogo">
        <div class="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
        <div class="pull-right"><img src={uploadedLogo} width="70" height="70" alt="Sprout" /></div>
        <div class="clearfix"></div>
      </div>
      <div className="chart-table-container">
      <div
        className="chart-section"
        style={{ border: 'none', boxShadow: 'none', marginLeft: '50px' }}
      >
        <DoughnutChart3 eventId={eventDetails.eventId} />
      </div>
      <div className="table-section">
        <table>
          <thead>
            <tr>
              
              <th>Emission Type</th>
              <th>Value</th>
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
  
	
	<div class="row page-break" >
    <div class="col-md-12">
      <div class="PageTitleLogo">
        {/* <div class="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div> */}
        {/* <div class="pull-right"><img src={uploadedLogo} width="50" height="50" alt="Sprout" /></div> */}
        <div class="clearfix"></div>  
      </div>
      <div class="mainTxt" >
      <TravelModeDoughnutChart attendeeTravelConsumptions={attendeeDetails.attendeeTravelConsumptions} />
      </div>
      
    </div>
  </div>
  </div>
  <div class="row page-break" ref={reportRef11}>
    <div class="col-md-12">
      <div class="PageTitleLogo">
        <div class="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
        <div class="pull-right"><img src={uploadedLogo} width="70" height="70" alt="Sprout" /></div>
        <div class="clearfix"></div>
      </div>
      <div class="mainTxt">
        
      <MealConsumptionDoughnutChart attendeeMealConsumptions={attendeeDetails.attendeeMealConsumptions} />
      </div>
      
    </div>
  </div>
  <div class="row page-break" ref={reportRef12}>
  <div class="col-md-12">
  <div class="PageTitleLogo">
        <div class="pull-left"><img src={sproutImg} width="103" height="50" alt="Sprout" /></div>
        <div class="pull-right"><img src={uploadedLogo} width="70" height="70" alt="Sprout" /></div>
        <div class="clearfix"></div>
      </div>
  <div className="mainTxt" style={{ width: '100% !important' }}>
      <div className="GreenBoxTitle" >Emissions Breakdown by Scope and Activity</div>
        <br />
      <table className="table table-bordered" style={{ display: 'table', width: '100% !important', borderCollapse: 'collapse',  tableLayout: 'fixed' }}>
      <thead>
        <tr>
          <th>Scope</th>
          <th>Activities</th>
          <th>Emissions (kgCO2e)</th>
        </tr>
      </thead>
      <tbody>
  <tr>
    {/* Scope 1 spans two rows */}
    <td rowSpan="3" valign="top" style={{ paddingBottom: '10px' }}>Scope 1 (Direct Emissions)</td>
    <td valign="top">Invitation Emails</td>
    <td valign="top">
      {filteredData.find(item => item.emissionType === "Invitation Emails")?.cumulativevalue.toFixed(2) || '0.00'}
    </td>
  </tr>
  <tr>
    <td valign="top">Printed Invitations</td>
    <td valign="top">
      {filteredData.find(item => item.emissionType === "Printed Invitations")?.cumulativevalue.toFixed(2) || '0.00'}
    </td>
  </tr>
  <tr>
    <td valign="top">Fuel Consumption in DG Sets and Transportation</td>
    <td valign="top">{fuelConsumptionQuantity}</td>
  </tr>
  <tr>
    {/* Scope 2 starts */}
    <td valign="top">Scope 2 (Indirect Emissions)</td>
    <td valign="top">Electricity Consumption</td>
    <td valign="top">{electricityConsumptionQuantity}</td>
  </tr>
  <tr>
    {/* Scope 3 starts */}
    <td rowSpan="8" valign="top">Scope 3 (Indirect Emissions)</td>
    <td valign="top">Snacks/Drinks</td>
    <td valign="top">{snacksDrinksQuantity}</td>
  </tr>
  <tr>
    <td valign="top">Material Consumption</td>
    <td valign="top">{materialConsumptionQuantity}</td>
  </tr>
  <tr>
    <td valign="top">Attendee Travel</td>
    <td valign="top">{getEmissionValue("Attendee travel")}</td>
  </tr>
  <tr>
    <td valign="top">Attendee Accommodation</td>
    <td valign="top">{getEmissionValue("Attendee Accommodation")}</td>
  </tr>
  <tr>
    <td valign="top">Attendee Meals</td>
    <td valign="top">{getEmissionValue("Attendee Meal")}</td>
  </tr>
  <tr>
    <td valign="top">Waste Generation</td>
    <td valign="top">{wasteGeneration}</td>
  </tr>
  <tr>
    <td valign="top">Pre Event Meetings</td>
    <td valign="top">{filteredData.find(item => item.emissionType === "Meeting")?.cumulativevalue.toFixed(2) || '0.00'}</td>
  </tr>
  <tr>
    {/* Total emission row */}
    <td valign="top" bgcolor="#DDD9C3"><strong>Total Emission from CoOL Conclave</strong></td>
    <td valign="top" bgcolor="#DDD9C3"><strong>{totalEstimatedCarbonEmission ? totalEstimatedCarbonEmission.toFixed(2) : 'Loading...'}</strong></td>
  </tr>
</tbody>

    </table>
</div>  
</div>


  
	<div class="row page-break">
    <div class="col-md-12">
     
      <div class="GreenBoxTitle"> CONCLUSION </div>
      <div class="mainTxt">
        <p>{eventDetails.eventName || "Event Name"} team has taken significant steps to minimize the event's carbon  footprint, implementing various strategies such as energy-efficient venue  selection, promoting sustainable transportation options, and reducing waste.  Despite these efforts, a total of 153 carbon credits are required to fully  offset the residual emissions from the event. By purchasing these carbon  credits, the team aims to neutralize their environmental impact, supporting  projects that reduce or remove an equivalent amount of greenhouse gases from  the atmosphere. This commitment underscores the event's dedication to  sustainability and decarbonization.</p>
</div>
      
      
    </div>
  </div>
  </div>
  

</div>
</div>
</div>
</div>

        
        
<div className="row page-break">
              <div className="col-md-12">
              <div className="report-buttons">
                {/* <button className="btn GreenBtn" onClick={handleGenerateReport}>Generate Report</button> */}
                <PreviewReport eventDetails={eventDetails}
                        sproutImg={sproutImg}
                        uploadedLogo = {uploadedLogo}
                        preEventData={preEventData}
                        duringEventData={duringEventData}
                        postEventData={postEventData}
                        totalEstimatedCarbonEmission={totalEstimatedCarbonEmission} 
                        attendeeTravelConsumptions={attendeeDetails.attendeeTravelConsumptions}
                        attendeeMealConsumptions={attendeeDetails.attendeeMealConsumptions}
                        attendeeDetails={attendeeDetails}
                      
                        emissionsData={emissionsData} 
                        image1={image1}
                        image2={image2}
                        image3={image3}
                        image4={image4}
                        image5={image5}
                        image6={image6}
                        image7={image7}
                        highlight1={highlight1}
                        highlight2={highlight2}
                        highlight3={highlight3}
                        highlight4={highlight4}
                        textContent1={textContent1}
                        textContent2={textContent2}
                        textContent3={textContent3}
                        textContent4={textContent4}
                        textContent5={textContent5}
                        textContent6={textContent6}
                        />
                <button className="btn GreenButton" onClick={handleDownloadPDF}>Download PDF</button> 
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

export default Report;
