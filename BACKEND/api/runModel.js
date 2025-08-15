import DataParsing from "../dataParser.js";
import { pipeline } from "@xenova/transformers";

// 🔹 Load HF token
const HF_TOKEN = process.env.HF_TOKEN;

// 🔹 Cache the model outside the handler
let classifierPromise = null;

async function getClassifier() {
  if (!HF_TOKEN) throw new Error("HF_TOKEN is not set in environment variables");
  if (!classifierPromise) {
    classifierPromise = pipeline('text-classification', 'saifmk/EC-AGENT-MODELS', {
      revision: 'main',
      subfolder: 'onnx',
      quantized: false,
      token: HF_TOKEN
    });
  }
  return classifierPromise;
}

// 🔹 API handler
export default async function handler(req, res) {
  // 🔹 Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔹 Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing 'text' in request body." });

  try {
    // 🔹 Load classifier
    const classifier = await getClassifier();

    // 🔹 Classification
    const result = await classifier(text, { topk: 1 });
    const prediction = result[0].label;

    // 🔹 Parse user input safely
    let parsed = [null, null, null];
    try {
      parsed = DataParsing.entityExtraction(text);
    } catch (err) {
      console.error("Parsing failed:", err);
    }

    // 🔹 Respond
    return res.status(200).json({
      prediction,
      doctorName: parsed[0] || null,
      appointmentTime: parsed[1] || null,
      appointmentDate: parsed[2] || null
    });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
