import axios from "axios";

const API_URL = "http://127.0.0.1:8000/chat";

export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(API_URL, { message });
    return response.data.response;
  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    throw new Error("Failed to fetch the AI response.");
  }
};
