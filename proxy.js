import express from "express";
import fetch from "node-fetch"; // Import `node-fetch` for HTTP requests
import cors from "cors"; // Middleware to handle CORS
import bodyParser from "body-parser"; // Middleware to parse JSON bodies

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Proxy route
app.post("/proxy", async (req, res) => {
  console.log("Request body received:", req.body); // Log the incoming request body for debugging

  try {
    // Send the request to the external Google Apps Script Web App
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzISl3b6YZ1D-fjzzixhQH-aRbwoCy4rn3btpSRGZDUchZWoKBv5tds-w8FUsaOL9I3/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure correct headers
        },
        body: JSON.stringify(req.body), // Forward the body as JSON
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text(); // Read the raw error response
      console.error(`External API Error: ${response.status} - ${errorText}`);
      return res
        .status(response.status)
        .send({ success: false, error: `External API Error: ${errorText}` });
    }

    // Parse the response (handle JSON or text responses)
    const resultText = await response.text();
    let result;
    try {
      result = JSON.parse(resultText); // Attempt to parse as JSON
    } catch (error) {
      console.warn("Received non-JSON response:", resultText); // Log if non-JSON
      result = resultText; // Fallback to raw text
    }

    // Send the response back to the client
    res.status(200).send(result);
  } catch (error) {
    // Handle unexpected errors
    console.error("Proxy error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
