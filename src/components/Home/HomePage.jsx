// HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleFirstClick = () => {
    navigate('/admin');
  };

  const handleSecondClick = () => {
    navigate('/subscription'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <h1 className="text-4xl font-bold mb-10">Welcome to the Home Page</h1>
      <div className="space-x-4">
        <button
          onClick={handleFirstClick}
          className="px-6 py-3 rounded-full bg-white text-blue-600 font-semibold shadow-lg hover:bg-blue-100 transition duration-200"
        >
          Admin Option
        </button>
        <button
          onClick={handleSecondClick}
          className="px-6 py-3 rounded-full bg-white text-purple-600 font-semibold shadow-lg hover:bg-purple-100 transition duration-200"
        >
          Subscription Option
        </button>
      </div>
    </div>
  );
};

export default HomePage;
