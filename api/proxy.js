module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
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
  } else if (req.method === "GET") {
    // Provide a user-friendly message for GET requests
    res.status(200).send(`
      <h1>Proxy Server</h1>
      <p>This server only accepts <strong>POST</strong> requests. To use this proxy:</p>
      <pre>
      POST https://your-proxy.vercel.app
      Content-Type: application/json

      {
        "key": "value"
      }
      </pre>
    `);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
