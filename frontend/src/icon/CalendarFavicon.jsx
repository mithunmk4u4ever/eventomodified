import React, { useEffect } from "react";
import { format } from "date-fns";

const CalendarFavicon = () => {
  useEffect(() => {
    const today = new Date();
    const day = format(today, "d");
    const month = format(today, "MMM");

    // Create a Canvas element
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    // Background Color
    ctx.fillStyle = "#ff4500"; // Change as needed
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Month text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(month, canvas.width / 2, 18);

    // Day text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px Arial";
    ctx.fillText(day, canvas.width / 2, 50);

    // Convert canvas to data URL
    const dataURL = canvas.toDataURL("image/png");

    // Update the favicon
    const favicon = document.getElementById("dynamic-favicon");
    if (favicon) {
      favicon.href = dataURL;
    }
  }, []);

  return null; // This component doesn't render anything
};

export default CalendarFavicon;
