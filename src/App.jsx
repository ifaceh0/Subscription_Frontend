import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Subscription from './components/Subscription';
import PlanDetails from './components/PlanDetails'; 
import Success from './components/Success'; 
import Cancel from './components/Cancel';
import AdminLookUp from './components/admin/AdminLookUp';
import HomePage from './components/Home/HomePage'; 

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/admin" element={<AdminLookUp />} />
        <Route path="/plan/:planType" element={<PlanDetails />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
