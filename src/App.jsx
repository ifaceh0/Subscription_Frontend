import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Subscription from './components/Subscription';
import PlanDetails from './components/PlanDetails'; 
import Success from './components/Success'; 
import Cancel from './components/Cancel';
import AdminLookUp from './components/admin/AdminLookUp';
import HomePage from './components/Home/HomePage'; 
import SubscriptionDashboard from './components/subscription dashboard/SubscriptionDashboard'
import ChangePlan from './components/subscription dashboard/ChangePlan'
import AddProduct from './components/subscription dashboard/AddProduct'
import ChangeSuccess from './components/subscription dashboard/ChangeSuccess';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/admin" element={<AdminLookUp />} />
          <Route path="/subscription-dashboard" element={<SubscriptionDashboard />} />
          <Route path="/subscription-dashboard/change-plan" element={<ChangePlan />} />
          <Route path="/subscription-dashboard/add-product" element={<AddProduct />} />
          <Route path="/plan/:planType" element={<PlanDetails />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/changeSuccess" element={<ChangeSuccess/>}/>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </ErrorBoundary>
    </>
  );
}

export default App;
