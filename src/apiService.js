import axios from "axios";
import { useAuth } from "./AuthProvider"; // Function to set up Axios interceptors
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { CategoryScale } from "chart.js";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log("API URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const setupInterceptors = (accessToken, navigate) => {
  api.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Navigate to login page on 401 Unauthorized error
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
};

export const useApi = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(accessToken, navigate);
  }, [accessToken, navigate]);

  return api;
};

export const getEventList = async () => {
  try {
    const response = await api.get("/api/Events/MyEventList");
    console.log("getEventList", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postEventData = async (data) => {
  try {
    const response = await api.post("/api/Events/AddEvent", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
export const getEventById = async (EventId) => {
  try {
    const response = await api.get(
      "/api/Events/GetEventById?EventId=" + EventId
    );
    console.log("getEventById", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getPublicEventDetails = async (eventId) => {
  try {
    const response = await api.get(`/api/Events/GetPublicEventDetails?EventId=${eventId}`);
    console.log("getPublicEventDetails", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching public event details:", error);
    throw error;
  }
};

export const GetEnergyConsumptionList = async (EventId) => {
  try {
    const response = await api.get(
      "/api/EnergyConsumption/GetEnergyConsumptionList?EventId=" + EventId
    );
    console.log("GetEnergyConsumptionList", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postEnergyConsumptionList = async (data) => {
  try {
    const response = await api.post(
      "/api/EnergyConsumption/UpdateEnergyConsumption",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const GetMealConsumptionList = async (EventId) => {
  try {
    const response = await api.get(
      `/api/MealConsumption/GetMealConsumptionList?EventId=` + EventId
    );
    console.log("GetMealConsumptionList", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching meal consumption data:", error);
    throw error;
  }
};

export const postMealConsumptionList = async (data) => {
  try {
    const response = await api.post(
      "/api/MealConsumption/UpdateMealConsumption",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting meal consumption data:", error);
    throw error;
  }
};

export const GetMaterialConsumptionList = async (EventId) => {
  try {
    const response = await api.get(
      `/api/DuringEvent/GetMaterialConsumptionList?EventId=` + EventId
    );
    console.log("GetMaterialConsumptionList", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching material consumption data:", error);
    throw error;
  }
};
export const postMaterialConsumptionList = async (data) => {
  try {
    const response = await api.post(
      "/api/DuringEvent/UpdateMaterialConsumption",
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error posting during event update material consumption data:",
      error
    );
    throw error;
  }
};

export const postDuringEventUpdateMementosMaterialFileData = async (data) => {
  try {
    const response = await api.post(
      "/api/DuringEvent/UpdateMementosMaterialFileData",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error posting during event update mementos material file data:",
      error
    );
    throw error;
  }
};

export const getEventConsumptionDetails = async (eventId) => {
  try {
    const response = await api.get(
      `/api/Individual/GetEventConsumptionDetails?EventId=${eventId}`
    );
    console.log("getEventConsumptionDetails", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching event consumption details:", error);
    throw error;
  }
};

export const postEventConsumptionDetails = async (data) => {
  try {
    const response = await api.post(
      "/api/Individual/AddEventConsumption",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting event consumption details:", error);
    throw error;
  }
};
export const addEventConsumptionV2 = async (data) => {
  try {
    const response = await api.post("/api/Individual/AddEventConsumptionV2", data);
    console.log("addEventConsumptionV2", response);
    return response.data;
  } catch (error) {
    console.error("Error adding event consumption data:", error);
    throw error;
  }
};

export const GetWasteConsumptionList = async (eventId) => {
  try {
    const response = await api.get(
      "/api/PostEvent/GetWasteConsumptionList?EventId=" + eventId
    );
    console.log("GetEnergyConsumptionList", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const postWasteConsumptionList = async (data) => {
  try {
    const response = await api.post(
      "/api/PostEvent/UpdateWasteConsumption",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting waste consumption data:", error);
    throw error;
  }
};

export const getTravelModes = async (Category) => {
  try {
    const response = await api.get(
      `api/TravelMode/GetTravelMode?Category=${Category}`
    );
    console.log("getTravelModes", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching travel modes", error);
    throw error;
  }
};

export const isAttendeeDetailsInitiated = async (eventId) => {
  try {
    const response = await api.get(
      `/api/DuringEvent/IsAttendeeDetailsInitiated?EventId=${eventId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching data from IsAttendeeDetailsInitiated API:",
      error
    );
    throw error;
  }
};

export const GetExtrapolateSummary = async (eventId) => {
  try {
    const response = await api.get(
      `/api/DuringEvent/GetExtrapolateSummary?EventId=${eventId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data from GetExtrapolateSummary API:", error);
    throw error;
  }
};

// Dashboard data
export const getDashboardData = async (eventId) => {
  try {
    const response = await api.get(
      `/api/Dashboard/GetDashBoardData?EventId=${eventId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export const getEmissionDuringEventActivity = async (eventId) => {
  try {
    console.log(`Fetching data for EventId: ${eventId}`); // Log before the API call
    const response = await api.get(
      `/api/Dashboard/GetEmissionDuringEventActivity?EventId=${eventId}`
    );
    console.log("API response:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Fetch event name list
export const getEventNameList = async (selectedRole) => {
  try {
    const response = await api.get(
      `/api/events/GetEventNameList?ListFor=${selectedRole}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event name list:", error);
    throw error;
  }
};

export const getEmissionPreEventActivity = async (eventId) => {
  try {
    const response = await api.get(
      `/api/Dashboard/GetEmissionPreEventActivity?EventId=${eventId}`
    );
    console.log("getEmissionPreEventActivity", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching emission pre-event activity data:", error);
    throw error;
  }
};

export const getEmissionPostEventActivity = async (eventId) => {
  try {
    const response = await api.get(
      `/api/Dashboard/GetEmissionPostEventActivity?EventId=${eventId}`
    );
    console.log("getEmissionPostEventActivity", response);

    return response.data;
  } catch (error) {
    console.error("Error fetching post-event emission activity data:", error);
    throw error;
  }
};

export const updateAttendeeConsumptions = async (data) => {
  try {
    const response = await api.post(
      "/api/DuringEvent/UpdateAttendeeConsumptions",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating attendee consumptions:", error);
    throw error;
  }
};

export const getIndividualEmission = async (eventId) => {
  try {
    const response = await api.get(
      `/api/dashboard/GetIndividualEmission?EventId=${eventId}`
    );
    console.log("getIndividualEmission", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching individual emission data:", error);
    throw error;
  }
};

export const getOrganizerEmission = async (eventId) => {
  try {
    const response = await api.get(
      `/api/dashboard/GetOrganizerEmission?EventId=${eventId}`
    );
    console.log("getOrganizerEmission", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching organizer emission data:", error);
    throw error;
  }
};

export const getInvitationsConsumptionList = async (eventId) => {
  try {
    const response = await api.get(
      `/api/preevent/GetInvitationsConsumptionList?EventId=${eventId}`
    );
    console.log("getInvitationsConsumptionList", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching invitations consumption data:", error);
    throw error;
  }
};

export const updateInvitationConsumption = async (consumptionList) => {
  try {
    const response = await api.post(
      "/api/preevent/UpdateInvitationConsumption",
      consumptionList
    );
    console.log("updateInvitationConsumption", response);
    return response.data;
  } catch (error) {
    console.error("Error updating invitations consumption data:", error);
    throw error;
  }
};

export const updateEventDetails = async (eventData) => {
  try {
    const response = await api.post("/api/Events/UpdateEvent", eventData);
    console.log("updateEventDetails", response);
    return response.data;
  } catch (error) {
    console.error("Error updating event details:", error);
    throw error;
  }
};

export const deleteEvent = async (eventIds) => {
  try {
    const response = await api.delete("/api/Events/DeleteEvent", {
      data: eventIds,
    });
    console.log("deleteEvent response:", response);
    return response.data;
  } catch (error) {
    console.error("Error deleting events:", error);
    throw error;
  }
};

export const DownloadTemplate = async (type) => {
  try {
    const response = await api.get(
      `/api/Download/DownloadTemplate?Type=${type}`
    );
    return response.data;
  } catch (error) {
    console.error("Error downloading template:", error);
    throw error;
  }
};

export const getIsMeetingAvailable = async (eventId) => {
  try {
    const response = await api.get(
      `/api/Meeting/IsMeetingAvailable?EventId=${eventId}`
    );
    console.log("getIsMeetingAvailable", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching getIsMeetingAvailable:", error);
    throw error;
  }
};
export const getMeetingList = async (eventId) => {
  try {
    const response = await api.get(
      `/api/Meeting/MeetingList?EventId=${eventId}`
    );
    console.log("getMeetingList: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching meeting data:", error);
    throw error;
  }
};

export const addMeeting = async (data) => {
  try {
    const response = await api.post("/api/Meeting/AddMeeting", data);
    console.log("Meeting Data: ", response);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const getMeetingSummary = async (eventId) => {
  try {
    const response = await api.get(
      `/api/Meeting/MeetingSummary?EventId=${eventId}`
    );
    console.log("getMeetingSummary: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching getMeetingSummary:", error);
    throw error;
  }
};

export const updateMeeting = async (data) => {
  try {
    const response = await api.post("/api/Meeting/UpdateMeeting", data);
    console.log("updateMeetingDetails", response);
    return response.data;
  } catch (error) {
    console.error("Error updating Meeting details:", error);
    throw error;
  }
};

export const deleteMeeting = async (meetingIds) => {
  try {
    const response = await api.delete("/api/Meeting/DeleteMeeting", {
      data: meetingIds,
    });
    console.log("deleteMeeting response:", response);
    return response.data;
  } catch (error) {
    console.error("Error deleting meetings:", error);
    throw error;
  }
};

export const updateMeetingInviteeList = async (updateMeetingInviteeList) => {
  try {
    const response = await api.post(
      "/api/Meeting/UpdateMeetingInviteeList",
      updateMeetingInviteeList
    );
    console.log("updateMeetingInviteeList", response);
    return response.data;
  } catch (error) {
    console.error("Error updating meeting invitee list:", error);
    throw error;
  }
};
export const getIndividualMeetingConsumptionDetails = async (meetingId) => {
  try {
    const response = await api.get(
      `/api/Organizer/GetIndividualMeetingConsumptionDetails?meetingId=${meetingId}`
    );
    console.log("getIndividualMeetingConsumptionDetails", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching individual meeting consumption details:",
      error
    );
    throw error;
  }
};

export const addUpdateIndividualMeetingData = async (data) => {
  try {
    console.log("Data: ", data);
    const response = await api.post(
      `/api/Organizer/AddIndividualMeetingData`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error adding/updating individual meeting data:", error);
    throw error;
  }
};
export const getUserMeetingList = async (eventId) => {
  try {
    const response = await api.get(
      `/api/Meeting/UserMeetingList?EventId=${eventId}`
    );
    console.log("getUserMeetingList:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user meeting list:", error);
    throw error;
  }
};

export const updateMeetingsSummary = async (summaryData) => {
  try {
    const response = await api.post(
      "/api/Meeting/UpdateMeetingsSummary",
      summaryData
    );
    console.log("UpdateMeetingsSummary response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating meetings summary:", error);
    throw error;
  }
};

export const UpdateAttendeeSummary = async (summaryData) => {
  try {
    const response = await api.post(
      "/api/DuringEvent/AddOrUpdateAttendeeSummary",
      summaryData
    );
    console.log("UpdateMeetingsSummary response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating meetings summary:", error);
    throw error;
  }
};
