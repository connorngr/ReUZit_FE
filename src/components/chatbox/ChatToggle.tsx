import { motion } from "framer-motion"

interface ToggleProps {
    toggleChat: () => void
}

const ChatToggle: React.FC<ToggleProps> = ({toggleChat}) => {
  return (
    <motion.button
          className="fixed bottom-5 left-5 bg-black text-white px-4 py-2 rounded-full z-50"
          onClick={toggleChat}
          initial={{ opacity: 0, scale: 0.8 }} // Initial state: invisible and scaled down
          animate={{ opacity: 1, scale: 1 }}   // Animate to full opacity and normal scale
          transition={{ duration: 0.3 }}       // Transition duration
          whileHover={{ scale: 1.1 }}          // Scale up a bit on hover
          whileTap={{ scale: 0.9 }}            // Scale down on tap (click)
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white block border-gray-200 align-middle"
          >
            <path
              d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
              className="border-gray-200"
            />
          </svg>
        </motion.button>
  )
}

export default ChatToggle