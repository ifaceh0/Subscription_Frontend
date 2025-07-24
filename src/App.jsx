import { Routes, Route } from 'react-router-dom';
import Subscription from './components/Subscription';
import PlanDetails from './components/PlanDetails'; // You need to create this

function App() {
  return (
    <Routes>
      <Route path="/" element={<Subscription />} />
      <Route path="/plan/:planType" element={<PlanDetails />} />

    </Routes>
  );
}

export default App;
