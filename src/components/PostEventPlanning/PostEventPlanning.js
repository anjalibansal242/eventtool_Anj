import { useLocation, Route, Routes } from 'react-router-dom';
import EcoIndex from '../../EcoIndex';
import EventDetailsSidebar from '../../eventDetailsSidebar';
import WasteGenaration from '../WasteGeneration/WasteGeneration';

import './PostEventPlanning.css';

const PostEventPlanning = () => {
  const location = useLocation();
  const eventDetails = location.state?.event;

  return (
    <div className="post-planning">
      <EcoIndex />
    
      <div className="main-content">
      {<EventDetailsSidebar eventDetails={eventDetails} /> }
  
        
        <Routes>
    
          <Route path="waste-generation" element={<WasteGenaration eventDetails={eventDetails} />} />
         
        </Routes>
      </div>
    </div>
  );
};

export default PostEventPlanning;