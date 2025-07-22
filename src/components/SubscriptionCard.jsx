import { Check} from 'lucide-react';

const SubscriptionCard = ({ title, price, features, buttonText, color, icon: Icon, billingCycle, isPopular }) => {
  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg w-full max-w-sm bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl ${isPopular ? 'ring-4 ring-yellow-300' : ''}`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-900 px-2 py-1 text-xs font-semibold rounded">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className={`px-6 py-4 flex justify-center text-center ${color}`}>
        <div>
          <div>
            {Icon && (
              <div 
              className='mb-2 flex justify-center'
              >
                <Icon 
                className="h-8 w-8 text-white" 
                />
              </div>
              )}
            </div>
          
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-white text-sm">
            {title === 'Basic'
              ? 'Perfect for individuals and small teams'
              : title === 'Pro'
              ? 'Ideal for growing businesses'
              : 'For large organizations with complex needs'}
          </p>
        </div>
      </div>
        {/* Price */}
        <div 
            className="px-6 py-4 text-left"
        >
        {
            billingCycle === 'yearly' && title === 'Enterprise' ? (
                <p 
                    className="text-2xl font-bold text-gray-900"
                >
                Contact Sales
                </p> ) : (
                <>
                    {(billingCycle === 'quarterly' || billingCycle === 'yearly') && (
                        <p 
                            className="text-sm text-green-600 font-medium mb-1"
                        >
                        Save {billingCycle === 'quarterly' ? '20%' : '30%'} 
                        compared to monthly
                        </p>
                    )}

                    <div 
                        className="space-y-1"
                    >
                    {(billingCycle === 'quarterly' || billingCycle === 'yearly') && (
                        <div 
                            className="text-sm text-gray-400 line-through"
                        >
                        Original: ${(
                            parseFloat(price['monthly']?.replace(/[^0-9.]/g, '')) *
                            (billingCycle === 'quarterly' ? 3 : 12)
                            ).toFixed(2)}
                        </div>
                    )}

                    <div 
                        className="flex items-baseline gap-1"
                    >
                    <span 
                        className="text-3xl font-bold text-gray-900"
                    >
                    {price[billingCycle]?.split(' ')[0]}
                    </span>
                    <span 
                        className="text-gray-500 text-base font-medium"
                    >
                    {price[billingCycle]?.split(' ')[1]}
                    </span>
                    </div>
                </div>
            </>
        )}
    </div>



      {/* Features */}
      <ul className="px-6 pb-4 space-y-2 text-left">
        {features.map((feat, i) => (
          <li key={i} className="flex items-center text-gray-700">
            <Check className="w-4 h-4 mr-2 text-green-500" />
            {feat}
          </li>
        ))}
      </ul>

      {/* Button */}
      <div className="px-6 pb-6">
        <button
          className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-1 ${
            title === 'Basic'
              ? 'bg-purple-600 hover:bg-purple-700'
              : title === 'Pro'
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
