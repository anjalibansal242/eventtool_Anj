// src/components/Login.js
import React, { useEffect } from 'react';
import userManager from './oidc-config';

const Login = () => {
  useEffect(() => {
   const u= userManager.signinRedirect();
   console.log('user',u)
  }, []);

  return (
    <div>
      <h2>Loading...</h2>
    </div>
  );
};

export default Login;
