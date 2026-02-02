
import { GoogleGenAI, Type } from "@google/genai";

// Always use the required initialization format for GoogleGenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStreamOptimization = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك خبير في البث المباشر، اقترح 3 عناوين جذابة ووصفاً قصيراً (SEO) ومجموعة من الوسوم للبث المباشر التالي: ${topic}. رد بتنسيق JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["titles", "description", "tags"]
        }
      }
    });
    // Access the .text property directly as it is a getter
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const moderateChat = async (messages: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `حلل هذه الرسائل في المحادثة المباشرة واقترح أي رسائل يجب حذفها أو مستخدمين يجب حظرهم بناءً على خطاب الكراهية أو السب. الرسائل: ${messages.join(' | ')}. رد بملخص سريع للنبرة العامة.`,
    });
    // Access the .text property directly
    return response.text;
  } catch (error) {
    return "تعذر تحليل المحادثة حالياً.";
  }
};
