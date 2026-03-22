import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Subscription from './components/subscription/Subscription';
import PlanDetails from './components/subscription/PlanDetails'; 
import Success from './components/subscription/Success'; 
import Cancel from './components/subscription/Cancel';
import AdminLookUp from './components/admin/dashboard/AdminLookUp';
import AddApplication from './components/admin/sidebar/AddApplication';
import PlanType from './components/admin/sidebar/PlanType';
import HomePage from './components/Home/HomePage'; 
import SubscriptionDashboard from './components/subscription dashboard/SubscriptionDashboard'
import ChangePlan from './components/subscription dashboard/change plan/ChangePlan'
import AddProduct from './components/subscription dashboard/add app/AddProduct'
import ChangeSuccess from './components/subscription dashboard/change plan/ChangeSuccess';
import ErrorBoundary from './components/ErrorBoundary';
import AddSuccess from './components/subscription dashboard/add app/AddSuccess';
import TrailDaysSettingsPage from './components/admin/sidebar/TrialDaysSettingsPage';
import DiscountManager from './components/admin/sidebar/DiscountManager';
import CurrencyConfigManager from './components/admin/sidebar/CurrencyConfigManager';
import EnterCompanyEmail from './components/subscription dashboard/EnterCompanyEmail';
import RenewSuccess from './components/subscription dashboard/add app/RenewSuccess';
import Footer from './components/Footer';
import Support from './components/support/Support';
import TermsOfService from './components/support/TermsOfService';
import PrivacyPolicy from './components/support/PrivacyPolicy';
import Faq from './components/support/Faq';
import AdminLogin from './components/admin/signin/AdminLogin';
import AdminSignup from './components/admin/signin/AdminSignup';
import AdminRoute from './components/admin/dashboard/AdminRoute';

function App() {
  return (
    <>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/login-admin" element={<AdminLogin />} />
              <Route path="/signup-admin" element={<AdminSignup />} />
              {/* <Route path="/admin" element={<AdminLookUp />} /> */}
              {/* <Route path="/admin/add-application" element={<AddApplication />} /> */}
              {/* <Route path="/admin/plan-type" element={<PlanType />} /> */}
              {/* <Route path="/admin/trial-days-settings" element={<TrailDaysSettingsPage />} /> */}
              {/* <Route path="/admin/discounts" element={<DiscountManager />} /> */}
              {/* <Route path="/admin/currency-config" element={<CurrencyConfigManager />} /> */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLookUp />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/add-application"
                element={
                  <AdminRoute>
                    <AddApplication />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/plan-type"
                element={
                  <AdminRoute>
                    <PlanType />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/trial-days-settings"
                element={
                  <AdminRoute>
                    <TrailDaysSettingsPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/discounts"
                element={
                  <AdminRoute>
                    <DiscountManager />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/currency-config"
                element={
                  <AdminRoute>
                    <CurrencyConfigManager />
                  </AdminRoute>
                }
              />
              <Route path="/subscription-dashboard" element={<SubscriptionDashboard />} />
              <Route path="/subscription-dashboard/change-plan" element={<ChangePlan />} />
              <Route path="/subscription-dashboard/add-product" element={<AddProduct />} />
              <Route path="/plan/:planType" element={<PlanDetails />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/changeSuccess" element={<ChangeSuccess/>}/>
              <Route path="/addSuccess" element={<AddSuccess/>}/>
              <Route path="/view-dashboard" element={<EnterCompanyEmail />} />
              <Route path="/renew-success" element={<RenewSuccess />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/faq" element={<Faq />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </ErrorBoundary>
    </>
  );
}

export default App;
