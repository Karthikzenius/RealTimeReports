const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 5000;

app.use(cors());

app.get("/agent", async (req, res) => {
  try {
    const response = await axios.get("http://10.16.7.80:5001/agent");
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/cdr", async (req, res) => {
  try {
    const response = await axios.get("http://10.16.7.80:5001/cdr");
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/queue", async (req, res) => {
  try {
    const response = await axios.get("http://10.16.7.80:5001/queue");
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
