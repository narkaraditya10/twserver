const axios = require("axios");

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Google Apps Script URL
  const googleScriptURL =
    "https://script.google.com/macros/s/AKfycbzISl3b6YZ1D-fjzzixhQH-aRbwoCy4rn3btpSRGZDUchZWoKBv5tds-w8FUsaOL9I3/exec";

  try {
    // Forward the request to the Google Apps Script
    const response = await axios.post(googleScriptURL, req.body, {
      headers: { "Content-Type": "application/json" },
    });

    // Forward the response back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in proxy:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
