import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessages";

interface ChatMessage {
    sender: string;
    message: string;
    isAI: boolean;
  }
  
  interface ChatContainerProps {
    messages: ChatMessage[];
  }

  const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // Trigger effect whenever messages update

  return (
    <div
      ref={chatContainerRef}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className="h-4/5 overflow-y-auto pr-4 pb-5 rounded-md scroll-smooth"
    >
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          sender={msg.sender}
          message={msg.message}
          isAI={msg.isAI}
        />
      ))}
    </div>
  );
};

export default ChatContainer;
