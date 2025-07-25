// server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import { envDefaults } from "./envDefaults.js";
import {
  uploadPdf,
  getParsedData,
  getJobStatus,
  sendUserChat,
  pingGemini,
} from "./controllers/uploadController.js";
const app = express();
const PORT = envDefaults.PORT;

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use(cors({
  origin: envDefaults.FRONTEND_URL,
}));
app.use(express.json());
// Multer config for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });



// ===  Endpoint ===
app.post("/upload", upload.single("pdf"), uploadPdf);
app.get("/getparseddata/:id", getParsedData);
app.get("/get_job_status/:id", getJobStatus);
app.post("/send_user_chat", sendUserChat);
app.post("/ping_gemini", pingGemini);

//health check
app.get("/", (req, res) => {
  res.send("Hello World");
});




// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
