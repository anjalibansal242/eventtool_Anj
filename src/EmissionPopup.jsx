import React, { useEffect, useRef } from "react";
import "./ModalStyles.css";
import ReactSpeedometer from "react-d3-speedometer";

const EmissionPopup = ({ message, onClose, onConfirm, totalEmission }) => {
  const modalRef = useRef(null);

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const getEmissionMessage = () => {
    if (totalEmission >= 160) {
      return "Oops! You exceeded the carbon emissions limit.";
    } else if (totalEmission >= 80) {
      return "You are within the carbon emissions limit.";
    } else {
      return "Great! You are below the carbon emission limit.";
    }
  };

  const getEmissionColor = () => {
    if (totalEmission >= 160) {
      return '#f00018'; 
    } else if (totalEmission >= 80) {
      return '#ffa342';  
    } else {
      return '#4dbce8';
    }
  };

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="modal-overlay">
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-description"
        tabIndex="-1"
        ref={modalRef}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="alert-title">
              { message}
              </h5>
              <button
                type="button"
                className="close"
                onClick={onClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

          
            <div className="modal-body" id="alert-description">
            
<div className="for-flex">
<div className="speedo" >
<ReactSpeedometer
      width={220}
      height={220}
      needleTransitionDuration={4000}
      needleColor="black"
      value={Math.min(totalEmission || 0, 240)} 
      minValue={0}
      maxValue={240} 
      segments={3}
      segmentColors={["#4dbce8", "#ffa342", "#f00018"]} 
      customSegmentStops={[0, 80, 160, 240]} 
      forceRender={true} 
      labelFontSize={"0px"}
      ringWidth={40}
      valueTextFontSize={"0px"}
    />
</div>


<div>
              {totalEmission !== null && (
                <div className="emission-info">
                  <p className="emission-meter"><strong>TOTAL EMISSION:</strong></p>
                  <div 
                    className="emission-value"
                    style={{ color: getEmissionColor(), fontSize: "20px" }}
                  >
                    {totalEmission ? `${totalEmission} kg CO2` : "Calculating..."}
                  </div>
                  <div 
                    className="emission-level"
                    style={{ color: getEmissionColor() }}
                  >
                    {getEmissionMessage()}
                  </div>
                </div>
              )}
                 
           </div>

           </div>
           
            
            </div>
           
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirm}
              >
                OK
              </button>
            </div>
           
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default EmissionPopup;
