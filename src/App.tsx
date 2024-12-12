import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import Navbar from './components/layout/Navbar';
import './assets/styles/App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import ChatBox from './components/chatbox/ChatBox';
import ChatToggle from './components/chatbox/ChatToggle';
import { SearchProvider} from './context/SearchContext';

const App = () => {
  const [isChatVisible, setChatVisible] = useState(false);

  const toggleChat = () => {
    setChatVisible((prev) => !prev);
  };

  return (
    <Router>
      <ToastContainer />
      <AuthProvider>
      <SearchProvider>
          <Navbar />
          <AppRoutes />
          <ChatToggle toggleChat={toggleChat} />
        <ChatBox isVisible={isChatVisible} />
        </SearchProvider>
      </AuthProvider>
    </Router>

  );
};

export default App;
