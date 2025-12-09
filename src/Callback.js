// src/Callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userManager from './oidc-config';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirectCallback = async () => {
      try {
        console.log('Attempting to handle redirect callback');
        const user = await userManager.signinRedirectCallback();
        console.log('User:', user);
        navigate('/events');
      } catch (err) {
        console.error('Callback Error:', err);
       
      }
    };
    console.log('Attempting to get token');
    handleRedirectCallback();
  }, [navigate]);
  return <div>Loading...</div>;  // You can add a loading spinner or message here
};

export default Callback;
