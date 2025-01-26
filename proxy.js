const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

// Google Apps Script URL
const googleScriptURL =
  "https://script.google.com/macros/s/AKfycbzISl3b6YZ1D-fjzzixhQH-aRbwoCy4rn3btpSRGZDUchZWoKBv5tds-w8FUsaOL9I3/exec";

app.use(express.json()); // Parse JSON requests

// Debug: Log incoming requests
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  next();
});

// Proxy route
app.post("/proxy", async (req, res) => {
  try {
    console.log("Forwarding data to Google Apps Script...");
    console.log("Payload:", req.body);

    // Forward the request to Google Apps Script
    const response = await axios.post(googleScriptURL, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response from Google Apps Script:", response.data);

    // Handle successful response
    if (response.status === 200) {
      const redirectURL = req.body.redirectURL || "https://example.com";
      console.log("Redirecting to:", redirectURL);
      res.redirect(302, redirectURL);
    } else {
      console.error(
        "Google Apps Script Error:",
        response.status,
        response.data
      );
      res.status(500).json({ error: "Google Apps Script failed." });
    }
  } catch (error) {
    console.error("Error during request:", error.message);
    console.error("Error details:", error.response?.data || error.stack);
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
});

// Add CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
