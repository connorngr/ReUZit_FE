import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import Navbar from './components/layout/Navbar';
import './assets/styles/App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { SearchProvider} from './context/SearchContext';

const App = () => {
  return (
    <Router>
      
      <ToastContainer/>
      <AuthProvider>
      <SearchProvider>
          <Navbar />
          <AppRoutes />
        </SearchProvider>
      </AuthProvider>
    </Router>

  );
};

export default App;
