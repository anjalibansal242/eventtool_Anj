import React, { useEffect, useState } from "react";
import { getOrganizerEmission, getIndividualEmission } from "./apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const OrganizerTotal = ({ eventId }) => {
  const [emissionData, setEmissionData] = useState({});
  const [attendeeEmission, setAttendeeEmission] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmissionData = async () => {
      setLoading(true);
      try {
        const organizerData = await getOrganizerEmission(eventId);
        const attendeeData = await getIndividualEmission(eventId);

        setEmissionData(organizerData);
        setAttendeeEmission(attendeeData);
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

  const formatEmission = (value) => value?.toFixed(2);

  const totalEmission =
    (emissionData?.totalCarbonEmission || 0) +
    (attendeeEmission?.totalCarbonEmission || 0);

  return (
    <div className="row justify-content-center">
      <div className="col-md-3">
        <div className="DashbordNoBox">
          <p>
            <FontAwesomeIcon icon={faUser} className="icon-shadow" />
          </p>
          <h2>
            My Contribution in Total
            <br /> Carbon Emission
          </h2>
          <p>
            {totalEmission > 0
              ? `${formatEmission(totalEmission)} KgCO₂`
              : "No data available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizerTotal;
