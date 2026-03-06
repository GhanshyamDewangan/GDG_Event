import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RegistrationPage from './pages/RegistrationPage';
import SuccessPage from './pages/SuccessPage';
import TicketPage from './pages/TicketPage';
import LoginPage from './pages/LoginPage';
import ScannerDashboard from './pages/ScannerDashboard';
import ScannerPage from './pages/ScannerPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/scanner" element={<ScannerDashboard />} />
          <Route path="/scan" element={<ScannerPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
