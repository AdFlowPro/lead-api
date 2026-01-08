import express from "express";

const app = express();
app.use(express.json());

// Simple API key auth
const API_KEY = process.env.API_KEY || "CHANGE_ME";

// Middleware
app.use((req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// In-memory storage (fast + enough for now)
const leads = {};

// 1️⃣ CREATE LEAD (they send leads to you)
app.post("/api/leads", (req, res) => {
  const { click_id, name, email, phone, geo, offer } = req.body;

  if (!click_id) {
    return res.status(400).json({ error: "click_id required" });
  }

  leads[click_id] = {
    click_id,
    name,
    email,
    phone,
    geo,
    offer,
    status: "lead",
    created_at: new Date().toISOString(),
  };

  res.json({
    success: true,
    click_id,
    status: "lead",
  });
});

// 2️⃣ GET LEAD STATUS
app.get("/api/leads/status", (req, res) => {
  const { click_id } = req.query;

  if (!click_id || !leads[click_id]) {
    return res.status(404).json({ error: "Lead not found" });
  }

  res.json(leads[click_id]);
});

// Health check
app.get("/", (req, res) => {
  res.send("Lead API running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
