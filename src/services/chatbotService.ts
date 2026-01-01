import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the API only if the key exists
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const chatbotService = {
  async sendMessage(message: string): Promise<string> {
    // Check for quick responses first to save API calls for simple greetings
    const quickResponse = this.getQuickResponse(message);
    if (quickResponse) {
      return quickResponse;
    }

    if (!genAI) {
      console.error("Gemini API Key is missing. Please check VITE_GEMINI_API_KEY in .env");
      return "I'm currently running in offline mode because my AI connection key is missing. Please contact support.";
    }

    try {
      // Use the flash model for speed and efficiency
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "You are Career Disha Assistant, an expert career counselor for Indian students. Be helpful, specific, and encouraging. Answer questions about colleges, exams (JEE, NEET, UPSC), scholarships, and career paths in India. Keep answers concise (under 150 words) unless asked for details." }],
          },
          {
            role: "model",
            parts: [{ text: "Namaste! I am your Career Disha Assistant. I am here to guide you through your educational and career journey in India. Ask me about colleges, entrance exams, or any career confusion you might have!" }],
          },
        ],
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error communicating with Gemini:", error);
      // Robust Fallback - Don't fail, just give a helpful generic response
      const fallbacks = [
        "I'm having a little trouble thinking clearly right now (Server Error). But generally, for career advice, focusing on your interests and strengths is key. Can you check my connection settings?",
        "It seems my AI brain is momentarily disconnected. Only a real counselor could answer that perfectly right now! Please try again in 10 seconds.",
        "I can't reach the Google AI servers currently. Please ensure you have a valid internet connection.",
      ];
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
  },

  getQuickResponse(message: string): string | null {
    const lowerMessage = message.toLowerCase().trim();

    // Simple greeting handler
    if (['hi', 'hello', 'hey', 'namaste'].includes(lowerMessage)) {
      return "Hello! I'm your AI Career Counselor. How can I help you regarding your career or studies today?";
    }

    return null;
  }
};