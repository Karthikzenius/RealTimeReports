// const redis = require("redis");

// // Create a Redis client with proper async/await setup
// async function run() {
//   const redisClient = redis.createClient({
//     socket: {
//       host: "10.16.7.11",
//       port: 6379,
//     },
//   });

//   redisClient.on("error", (err) => {
//     console.error("Redis connection error:", err);
//   });

//   try {
//     // Connect to the Redis server
//     await redisClient.connect();

//     const redisKey = "Realtime_Metrics_data";

//     // Get the value
//     const value = await redisClient.get(redisKey);

//     // Print the raw value for debugging
//     console.log(`Raw value of '${redisKey}': ${value}`);

//     // Clean the raw value to remove the trailing comma before parsing
//     const cleanedValue = value.replace(/,(\s*\])/, "$1");

//     // Attempt to parse the cleaned value to JSON
//     let jsonValue;
//     try {
//       jsonValue = JSON.parse(cleanedValue);
//     } catch (parseError) {
//       console.error("Error parsing JSON:", parseError);
//       console.error("Raw value that caused the error:", cleanedValue);
//       return; // Exit the function if JSON parsing fails
//     }

//     // Print or use the retrieved and parsed JSON value
//     console.log(`Parsed JSON value of '${redisKey}':`, jsonValue);
//   } catch (err) {
//     console.error("Error:", err);
//   } finally {
//     // Close the client
//     await redisClient.disconnect();
//   }
// }

// run();
// ==============================================
// const express = require("express");
// const redis = require("redis");
// const cors = require("cors");

// const app = express();
// const port = 3000;

// // Enable CORS for all routes
// app.use(cors());

// // Create a Redis client
// const redisClient = redis.createClient({
//   socket: {
//     host: "10.16.7.11",
//     port: 6379,
//   },
// });

// redisClient.on("error", (err) => {
//   console.error("Redis connection error:", err);
// });

// // Connect to Redis
// (async () => {
//   await redisClient.connect();
//   console.log("Connected to Redis");
// })();

// // Define a route to fetch data from Redis
// app.get("/api/Realtime-Metrics-Data", async (req, res) => {
//   const redisKey = "Realtime_Metrics_data";

//   try {
//     // Get the value from Redis
//     const value = await redisClient.get(redisKey);

//     // Clean the raw value to remove the trailing comma before parsing
//     const cleanedValue = value.replace(/,(\s*\])/, "$1");

//     // Parse the cleaned value to JSON
//     let jsonValue;
//     try {
//       jsonValue = JSON.parse(cleanedValue);
//     } catch (parseError) {
//       console.error("Error parsing JSON:", parseError);
//       console.error("Raw value that caused the error:", cleanedValue);
//       return res.status(500).json({ error: "Error parsing JSON" });
//     }

//     // Send the JSON response
//     res.json(jsonValue);
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Start the Express server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

const express = require("express");
const redis = require("redis");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Create a Redis client
const redisClient = redis.createClient({
  socket: {
    host: "10.16.7.80",
    port: 6379,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Connect to Redis
(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})();

// Define a route to fetch data from Redis
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

    // Send the JSON response
    res.json(jsonValue);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ============================================================

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

    // Send the JSON response
    res.json(jsonValue);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
