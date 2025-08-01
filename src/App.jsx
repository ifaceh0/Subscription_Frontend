import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Subscription from './components/Subscription';
import PlanDetails from './components/PlanDetails'; // You need to create this
import Success from './components/Success'; 
import Cancel from './components/Cancel';
import AdminLookup from './Admin/adminLookup'; // Ensure this path is correct

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Subscription />} />
        <Route path="/admin" element={<AdminLookup />} />
        <Route path="/plan/:planType" element={<PlanDetails />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
