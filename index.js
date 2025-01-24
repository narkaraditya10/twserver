const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Parse JSON requests

// Google Apps Script URL
const googleScriptURL =
  "https://script.google.com/macros/s/AKfycbzISl3b6YZ1D-fjzzixhQH-aRbwoCy4rn3btpSRGZDUchZWoKBv5tds-w8FUsaOL9I3/exec"; // Replace with your Google Apps Script URL

// Proxy route to handle form submission
app.post("/", async (req, res) => {
  try {
    const response = await axios.post(googleScriptURL, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Forward response from Google Apps Script to frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding request to Google Apps Script:", error);
    res.status(500).json({ error: "Failed to forward request" });
  }
});

// Allow CORS for the frontend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
