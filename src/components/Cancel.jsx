import { useNavigate } from 'react-router-dom';

const Cancel = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-red-600">Subscription Cancelled</h2>
        <p>You have cancelled the subscription process.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Plans
        </button>
      </div>
    </div>
  );
};

export default Cancel;