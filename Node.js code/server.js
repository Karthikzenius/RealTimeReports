const express = require("express");
const redis = require("redis");
const cors = require("cors");

const app = express();
// const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Create a Redis client
const redisClient = redis.createClient({
  socket: {
    host: "10.16.7.91",
    port: 6379,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})();

app.get("/api/Realtime-Metrics-Data", async (req, res) => {
  const redisKey = "Realtime_Queue_Metrics_data";

  try {
    const value = await redisClient.get(redisKey);

    if (value === null) {
      return res.status(404).json({ error: "Data not found" });
    }

    const cleanedValue = value.replace(/,(\s*\])/, "$1");

    let jsonValue;
    try {
      jsonValue = JSON.parse(cleanedValue);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.error("Raw value that caused the error:", cleanedValue);
      return res.status(500).json({ error: "Error parsing JSON" });
    }

    res.json(jsonValue);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/Realtime-AgentsMetrics-Data", async (req, res) => {
  const redisKey = "Realtime_Agent_Metrics_data";

  try {
    const value = await redisClient.get(redisKey);

    if (value === null) {
      return res.status(404).json({ error: "Data not found" });
    }

    const cleanedValue = value.replace(/,(\s*\])/, "$1");

    let jsonValue;
    try {
      jsonValue = JSON.parse(cleanedValue);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.error("Raw value that caused the error:", cleanedValue);
      return res.status(500).json({ error: "Error parsing JSON" });
    }

    res.json(jsonValue);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
const PORT = process.env.PORT || 3003;
const HOST = process.env.HOST || "0.0.0.0";

// Use app.listen instead of server.listen
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
