import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Subscription from './components/Subscription';
import PlanDetails from './components/PlanDetails'; 
import Success from './components/Success'; 
import Cancel from './components/Cancel';
import AdminLookUp from './components/admin/AdminLookUp';
import AddApplication from './components/admin/AddApplication';
import PlanType from './components/admin/PlanType';
import HomePage from './components/Home/HomePage'; 
import SubscriptionDashboard from './components/subscription dashboard/SubscriptionDashboard'
import ChangePlan from './components/subscription dashboard/ChangePlan'
import AddProduct from './components/subscription dashboard/AddProduct'
import ChangeSuccess from './components/subscription dashboard/ChangeSuccess';
import ErrorBoundary from './components/ErrorBoundary';
import AddSuccess from './components/subscription dashboard/AddSuccess';
import TrailDaysSettingsPage from './components/admin/TrialDaysSettingsPage';

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
          <Route path="/addSuccess" element={<AddSuccess/>}/>
          <Route path="/admin/add-application" element={<AddApplication />} />
          <Route path="/admin/plan-type" element={<PlanType />} />
          <Route path="/admin/trial-days-settings" element={<TrailDaysSettingsPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </ErrorBoundary>
    </>
  );
}

export default App;
