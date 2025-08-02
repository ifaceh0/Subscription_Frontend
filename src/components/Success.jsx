import { useLocation } from 'react-router-dom';

const Success = () => {
  const { search } = useLocation();
  const sessionId = new URLSearchParams(search).get('session_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl w-full max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Subscription Activated!
          </h2>
          <p className="text-gray-600 mb-4">
            Congratulations! Your subscription has been successfully activated.
          </p>
          {/* <button
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            onClick={() => window.location.href = '/dashboard'}
          >
            click the link for access the application
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Success;