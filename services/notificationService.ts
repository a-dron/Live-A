
import { GoogleGenAI } from "@google/genai";

// Always use the required initialization format for GoogleGenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendEmailAlert = async (userEmail: string, streamTitle: string, reason: string) => {
  console.log(`[Email Service] إرسال بريد إلكتروني إلى: ${userEmail}`);
  
  // محاكاة إرسال إيميل باستخدام Gemini لصياغة محتوى احترافي
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `اكتب نص رسالة بريد إلكتروني قصيرة واحترافية باللغة العربية تنبه المستخدم (المذيع) بأن البث المباشر بعنوان "${streamTitle}" قد انقطع بسبب "${reason}". اطلب منه العودة للوحة التحكم للتأكد.`,
    });
    
    console.log("%c--- محاكاة بريد إلكتروني مرسل ---", "color: orange; font-weight: bold;");
    // Access the .text property directly
    console.log(response.text);
    console.log("%c------------------------------", "color: orange; font-weight: bold;");
    
    return true;
  } catch (error) {
    console.error("خطأ في محاكاة الإيميل:", error);
    return false;
  }
};
