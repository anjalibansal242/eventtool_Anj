import React, { useEffect, useState } from 'react';
import { getIndividualEmission } from './apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaskVentilator, faUser, faBolt, faDroplet, faWeightScale, faPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const NumericDisplay = ({ eventId }) => {
  const [emissionData, setEmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmissionData = async () => {
      setLoading(true);
      try {
        const data = await getIndividualEmission(eventId);
        console.log('Attende TotalCarbonEmission : ', data);
        setEmissionData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmissionData();
  }, [eventId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const formatEmission = (value) => value.toFixed(2);
  return (
    
    <div className="row justify-content-center">
      <div className="col-md-3">
        <div className="DashbordNoBox">
        <p><FontAwesomeIcon icon={faUser} className="icon-shadow" /></p>
        <h2>My Contribution in Total<br></br> Carbon Emission</h2>
        <p>{emissionData ? `${formatEmission(emissionData.totalCarbonEmission)} KgCO₂` : "No data available"}</p>
        </div>
      

      </div>
      
    </div>
  );
};


export default NumericDisplay;
