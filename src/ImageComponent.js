import React from 'react';
import imagePath from './assets/attendeeDetails.jpg'; 
import './ImageComponent.css';

const ImageComponent = () => {
  return (
      <div>
          <img src={imagePath} className="img-fluid" alt="Attendee details steps" />
    </div>
  );
};

export default ImageComponent;
