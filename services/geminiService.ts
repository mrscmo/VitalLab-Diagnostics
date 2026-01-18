import { GoogleGenAI } from "@google/genai";

// Robust way to get API key in various environments without crashing
const getApiKey = () => {
  try {
    // Check various global scopes safely
    const globalScope = 
      (typeof globalThis !== 'undefined' ? globalThis : 
      (typeof window !== 'undefined' ? window : 
      (typeof self !== 'undefined' ? self : {}))) as any;

    if (globalScope.process?.env?.API_KEY) {
      return globalScope.process.env.API_KEY;
    }
  } catch (e) {
    // Suppress errors during environment checks
  }
  return '';
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn("Failed to initialize GoogleGenAI client:", e);
  }
}

export const askMedicalAssistant = async (question: string): Promise<string> => {
  if (!ai) {
    // Attempt lazy re-init in case key was injected late
    const currentKey = getApiKey();
    if (currentKey) {
        try {
            ai = new GoogleGenAI({ apiKey: currentKey });
        } catch(e) {}
    }
    
    if (!ai) {
        console.warn("Gemini API Key missing or client initialization failed.");
        return "I'm sorry, the AI service is currently unavailable. Please contact the lab directly.";
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `You are a helpful, professional, and empathetic medical laboratory assistant for 'VitalLab'. 
        Your goal is to help patients understand medical tests, preparation instructions (fasting, etc.), and general lab terminology.
        
        Rules:
        1. Keep answers concise and easy to understand for a layperson.
        2. NEVER provide a medical diagnosis. Always advise users to consult their doctor for interpretation of results.
        3. If asked about prices, say "Please check our catalog page for the most up-to-date pricing."
        4. Be polite and professional.`,
      },
    });

    return response.text || "I apologize, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server. Please try again later.";
  }
};