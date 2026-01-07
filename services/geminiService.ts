
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCaption } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Generates professional movie metadata and captions in Uzbek.
 */
export async function generateMovieCaption(movieTitle: string): Promise<GeneratedCaption | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate professional Telegram movie channel metadata for the film: "${movieTitle}". 
      Include genre, release year, a high-impact short description in Uzbek, and relevant cinema hashtags.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            genre: { type: Type.STRING },
            year: { type: Type.STRING },
            description: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "genre", "year", "description", "hashtags"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as GeneratedCaption;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return null;
  }
}

/**
 * Generates a helpful AI response for user messages in the movie bot.
 */
export async function generateAutoReply(userMessage: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: "Siz Telegram kino kanalining AI yordamchisiz. Foydalanuvchi savollariga (kino so'rovlari, yordam, minnatdorchilik) juda xushmuomala va do'stona o'zbek tilida javob bering. Javobingiz qisqa va aniq bo'lsin.",
        temperature: 0.7,
      }
    });
    return response.text || "Kechirasiz, hozir javob bera olmayman.";
  } catch (error) {
    console.error("Auto-reply Error:", error);
    return "Bot hozirda biroz band. Keyinroq urinib ko'ring.";
  }
}
