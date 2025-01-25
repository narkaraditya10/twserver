const axios = require("axios");

// Google Apps Script URL
const googleScriptURL =
  "https://script.google.com/macros/s/AKfycbzISl3b6YZ1D-fjzzixhQH-aRbwoCy4rn3btpSRGZDUchZWoKBv5tds-w8FUsaOL9I3/exec";

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    // Return a basic message or status for GET requests
    res.status(200).json({
      message:
        "This is a proxy server for Google Apps Script. Use POST to send data.",
    });
    return;
  }

  if (req.method === "POST") {
    try {
      // Forward the data to Google Apps Script
      const response = await axios.post(googleScriptURL, req.body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Return the response from Google Apps Script
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error forwarding request:", error);
      res.status(500).json({ error: "Failed to forward request" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
