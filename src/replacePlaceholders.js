// replacePlaceholders.js

// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      eventName: params.get("eventName"),
      hostOrganization: params.get("hostOrganization"),
      eventDate: params.get("eventDate"),
      eventType: params.get("eventType"),
      location: params.get("location"),
      assessmentDate: params.get("assessmentDate"),
    };
  }
  
  // Function to replace placeholders with actual event details
  function replacePlaceholders() {
    const details = getQueryParams();
  
    document.getElementById("eventNamePlaceholder").textContent = details.eventName || "N/A";
    document.getElementById("hostOrganizationPlaceholder").textContent = details.hostOrganization || "N/A";
    document.getElementById("eventDatePlaceholder").textContent = details.eventDate || "N/A";
    document.getElementById("eventTypePlaceholder").textContent = details.eventType || "N/A";
    document.getElementById("locationPlaceholder").textContent = details.location || "N/A";
    document.getElementById("assessmentDatePlaceholder").textContent = details.assessmentDate || "N/A";
  }
  
  // Call the function to replace placeholders
  replacePlaceholders();
  