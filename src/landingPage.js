import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './landingPage.css';
import sprout from './assets/sprout.png';

const LandingPage = () => {

  const location = useLocation();
  const [IDENTITY_BASE_URL, setIDENTITY_BASE_URL] = useState(process.env.REACT_APP_IDENTITY_BASE_URL + "/Identity/Account/Register");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventId = params.get('eventId');
    const q2 = params.get('q2');

    if (eventId && q2) {
      setIDENTITY_BASE_URL(IDENTITY_BASE_URL + `?eventId=${eventId}&q2=${q2}`);
    }
}, [location]);

  //const IDENTITY_BASE_URL = process.env.REACT_APP_IDENTITY_BASE_URL + "/Identity/Account/Register";

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    window.location.href = IDENTITY_BASE_URL;
  };

  return (

    
    <div id="pageWrp">
      <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-11">
          <div className="Divleft">
          <img src={sprout} alt="Sprout" className="sprout" />
          </div>
          <div className="DivRgtLink">
          <a onClick={handleLogin}>Login</a>
          <a onClick={handleSignUp}>Sign up</a>  
            </div>     
        
        </div>
       
      </div>
      <div className="row justify-content-center">
      <div className="col-md-11">     
        <div className="text-section">
          {/* <p>EcoIndex</p> */}
          <h1>Discover your Carbon Footprint & take the first step towards <br /> a Greener Future with our easy-to-use Carbon Emission Calculator.</h1>
          <h1>START CALCULATING FOR</h1>
          <div className="features-section">
            <a href="/login" className="button1">
              <span className="button1__icon-wrapper">
                <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="button1__icon-svg" width="10">
                  <path
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    fill="currentColor"
                  ></path>
                </svg>

                <svg
                  viewBox="0 0 14 15"
                  fill="none"
                  width="10"
                  xmlns="http://www.w3.org/2000/svg"
                  className="button1__icon-svg button1__icon-svg--copy"
                >
                  <path
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
              EVENTS
            </a>
            
          </div>
        </div>
      
      </div>
     </div>

<div className="row">
  <div className="col-md-12">
  <div className="Powered">Powered by <a href="http://octodosolutions.com/" target="_blank" rel="noopener noreferrer">OctoDo</a></div>
  </div>
</div>
      </div>
    </div>
  );
}

export default LandingPage;
