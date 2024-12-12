import { useState } from "react";
import ChatMessage from "./ChatMessages";
import MotionButton from "../common/button/MotionButton";
import { motion } from "framer-motion";
import { sendChatMessage } from "../../api/chatAPI";
import ChatContainer from "./ChatContainer";

interface ChatBoxProps {
    isVisible: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isVisible }) => {


    const [messages, setMessages] = useState([
        { sender: 'Assistant', message: 'Hi, how can I help you today?', isAI: true },
    ]);

    const [input, setInput] = useState('');

    const [loading, setLoading] = useState(false);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setInput("");
            setLoading(true);
            setMessages([
                ...messages,
                { sender: 'You', message: input, isAI: false }]);
            try {
                const aiResponse = await sendChatMessage(input);
                
                setMessages((prev) => [
                    ...prev,
                    { sender: "Assistant", message: aiResponse, isAI: true },
                ]);
            } catch (error) {
                console.error("Error sending message:", error);
                setMessages((prev) => [
                    ...prev,
                    { sender: "Assistant", message: "ReUZit's bot is sleeping !zzz", isAI: true },
                ]);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? "0" : "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-1/4 h-4/5">
            {/* Heading */}
            <div className="flex flex-col space-y-1.5 pb-6">
                <h2 className="font-semibold text-lg tracking-tight">
                    <b>ReUZit's</b> Assistant </h2>
                <p className="text-sm text-[#6b7280] leading-3">
                    Powered by Llama3.2
                </p>
            </div>

            <ChatContainer messages={messages} />

            {/* Input box */}
            <form
                onSubmit={handleSubmit}
                className="flex gap-2 items-center border-t p-2 bg-white"
            >
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <MotionButton
                    className={`ml-2 px-4 py-2 rounded-lg ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    type="submit"
                    disabled={loading}
                >
                    Send
                </MotionButton>
            </form>
        </motion.div>
    );
};

export default ChatBox;
