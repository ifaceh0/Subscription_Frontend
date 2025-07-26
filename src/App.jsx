import { Routes, Route } from 'react-router-dom';
import Subscription from './components/Subscription';
import PlanDetails from './components/PlanDetails'; // You need to create this
import Success from './components/Success'; 
import Cancel from './components/Cancel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Subscription />} />
      <Route path="/plan/:planType" element={<PlanDetails />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
    </Routes>
  );
}

export default App;
