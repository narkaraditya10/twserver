const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

// Google Apps Script URL
const googleScriptURL =
  "https://script.google.com/macros/s/AKfycbzISl3b6YZ1D-fjzzixhQH-aRbwoCy4rn3btpSRGZDUchZWoKBv5tds-w8FUsaOL9I3/exec";

app.use(express.json()); // Parse JSON requests

// Proxy route
app.post("/proxy", async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    // Forward the data to Google Apps Script
    const response = await axios.post(googleScriptURL, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response from Google Script:", response.data);

    if (response.status === 200) {
      const redirectURL = req.body.redirectURL || "https://example.com";
      res.redirect(302, redirectURL); // Send a 302 redirect response
    } else {
      res.status(500).json({ error: "Failed to store data in Google Sheets." });
    }
  } catch (error) {
    console.error("Error forwarding request to Google Apps Script:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
