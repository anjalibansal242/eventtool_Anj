import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import './App.css';
import EventsTable from './EventsTable';
import AddEvent from './AddEvent';
import DuringEventPlanning from './DuringEventPlanning';
import PostEventPlanning from './components/PostEventPlanning/PostEventPlanning.js';
import PreEventPlanning from "./PreEventPlanning";
import Individual from './Individual';
import { EventProvider } from './EventDetailsContext';
import EventDetails from './EventDetails';
import Callback from './Callback';
import Dashboard from './Dashboard'; 
import LandingPage from './landingPage'; 
import SignUp from './Form';
import LogoutCallback from './LogoutCallback';
import Organizer from './Organizer';
import AddInformation from './AddInformation';
import Report from './Report';
import PreviewReport from './previewReport';

function App() {
  return (
    <Router>
      <EventProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin-oidc" element={<Callback />} />
          <Route path="/events" element={<EventsTable />} />
          <Route path="/new-event" element={<AddEvent />} />
          <Route path="/events/event-details" element={<EventDetails />} />
          <Route path="/events/during-event-planning/*" element={<DuringEventPlanning />} />
          <Route path="/events/post-event-planning/*" element={<PostEventPlanning />} />
          <Route path="/events/pre-event-planning/*" element={<PreEventPlanning />} />
          <Route path="/events/individual/*" element={<Individual />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/signout-callback-oidc" element={<LogoutCallback />} />
          <Route path="/events/Organizer/*" element={<Organizer />} />
          <Route path="/add-information" element={<AddInformation />} /> 
          <Route path="/events/report" element={<Report />} />
          <Route path="/preview-report" element={<PreviewReport />} />
        </Routes>
      </EventProvider>
    </Router>
  );
}

export default App;
