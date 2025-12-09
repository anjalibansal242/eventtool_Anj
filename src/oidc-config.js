// src/oidc-config.js
import { UserManager, WebStorageStateStore } from 'oidc-client';

// Local Testing 

const IDENTITY_BASE_URL = process.env.REACT_APP_IDENTITY_BASE_URL;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI = process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI;

console.log("IDENTITY_BASE_URL: ", IDENTITY_BASE_URL);
console.log("CLIENT_ID: ", CLIENT_ID);
console.log("REDIRECT_URI: ", REDIRECT_URI);
console.log("POST_LOGOUT_REDIRECT_URI: ", POST_LOGOUT_REDIRECT_URI);



const settings = {
  authority: IDENTITY_BASE_URL, 
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile roles reactapp',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};


// QA/UAT 
// const settings = {
//   authority: 'https://identity.octodosolutions.com', 
//   client_id: 'f894333b-b71c-497c-9b8f-593b9a2363bc',
//   redirect_uri: 'https://ecoindex.octodosolutions.com/signin-oidc',
//   post_logout_redirect_uri: 'https//ecoindex.octodosolutions.com/signout-callback-oidc',
//   response_type: 'code',
//   scope: 'openid profile roles reactapp',
//   userStore: new WebStorageStateStore({ store: window.localStorage }),
// };

// Production
// const settings = {
//   authority: 'https://identity.ecoindex.ai', 
//   client_id: 'f2822bcd-23ee-4a97-ab32-9ea487f31889',
//   redirect_uri: 'https://ecoindex.ai/signin-oidc',
//   post_logout_redirect_uri: 'https//ecoindex.ai/signout-callback-oidc',
//   response_type: 'code',
//   scope: 'openid profile roles reactapp',
//   userStore: new WebStorageStateStore({ store: window.localStorage }),
// };


const userManager = new UserManager(settings);
userManager.events.addUserLoaded((user) => {
  console.log('User loaded:', user);
});

userManager.events.addUserUnloaded(() => {
  console.log('User unloaded');
});

userManager.events.addAccessTokenExpiring(() => {
  console.log('Access token expiring');
});

userManager.events.addAccessTokenExpired(() => {
  console.log('Access token expired');
});

userManager.events.addSilentRenewError((error) => {
  console.error('Silent renew error:', error);
});

userManager.events.addUserSignedOut(() => {
  console.log('User signed out');
});

export default userManager;