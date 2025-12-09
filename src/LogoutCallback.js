import React, { useEffect } from 'react';
import userManager from './oidc-config';

const LogoutCallback = () => {
  useEffect(() => {
    const signoutRedirectCallback = async () => {
      try {
        await userManager.signoutRedirectCallback();
        window.location.href = '/login';
      } catch (error) {
        console.error(error);
      }
    };

    signoutRedirectCallback();
  }, []);

  return <div>Logging out...</div>;
};

export default LogoutCallback;
