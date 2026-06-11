import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not defined");
  }
  return new GoogleGenerativeAI(apiKey);
}

export function getFlashModel() {
  return getClient().getGenerativeModel({
    model: "gemini-2.5-flash",
    safetySettings,
  });
}

export function getFlashModelJson() {
  return getClient().getGenerativeModel({
    model: "gemini-2.5-flash",
    safetySettings,
    generationConfig: { responseMimeType: "application/json" },
  });
}

export function getProModel() {
  return getClient().getGenerativeModel({
    model: "gemini-2.5-flash",
    safetySettings,
  });
}
