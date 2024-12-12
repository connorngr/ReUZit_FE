import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import Navbar from './components/Layout/Navbar';
import './assets/styles/App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import ChatBox from './components/chatbox/ChatBox';
import { motion } from 'framer-motion';
import ChatToggle from './components/chatbox/ChatToggle';


const App = () => {
  const [isChatVisible, setChatVisible] = useState(false);

  const toggleChat = () => {
    setChatVisible((prev) => !prev);
  };

  return (
    <Router>
      <ToastContainer />
      <AuthProvider>
        <Navbar />
        <AppRoutes />
        <ChatToggle toggleChat={toggleChat} />
        <ChatBox isVisible={isChatVisible} />
      </AuthProvider>
    </Router>

  );
};

export default App;
