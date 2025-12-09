import React from "react";
import { DownloadTemplate } from "./apiService";

const DownloadTemplateButton = ({ downloadtype }) => {
  const handleDownload = async () => {
    try {
      const fileUrl = await DownloadTemplate(downloadtype);
      console.log("fileUrl", fileUrl);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${downloadtype}.xlsx`;
      link.click();
    } catch (error) {
      console.error("Error downloading the template:", error);
    }
  };

  return (
    <div className="download-template-button">
      <button className="btn GreenBtn" onClick={handleDownload}>
        Download Template
      </button>
    </div>
  );
};

export default DownloadTemplateButton;
