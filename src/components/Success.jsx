import { useLocation } from 'react-router-dom';

    const Success = () => {
       const { search } = useLocation();
       const sessionId = new URLSearchParams(search).get('session_id');
       return (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
           <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
             <h2 className="text-3xl font-bold text-green-600">Subscription Successful!</h2>
             <p>Your subscription has been activated.</p>
             <p>Session ID: {sessionId}</p>
           </div>
         </div>
       );
    };

export default Success;