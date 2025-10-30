import React, { useState, lazy, Suspense } from 'react';
import { DhozziUser, Plan } from '../types';
import { CheckIcon, StarIcon, XIcon } from './Icons';

const PaymentModal = lazy(() => import('./PaymentModal'));

const planDetails = {
  basic: {
    name: "Basic",
    cost: 0,
    features: [
      "Access to Dhozzi (Flash)",
      "Standard image generation (Imagen 4.0)",
      "Standard chat history",
    ],
    theme: "from-blue-600 to-blue-700",
  },
  premium: {
    name: "Premium",
    cost: 40,
    features: [
      "All Basic features",
      "Access to advanced models (Gemini Pro, DALL-E 3)",
      "Unlock specialized creative & business models",
      "Longer Live Call durations",
    ],
    theme: "from-violet-600 to-violet-700",
  },
  platinum: {
    name: "Platinum",
    cost: 120,
    features: [
      "All Premium features",
      "Access to elite models (Gemini Pro Thinking, Midjourney)",
      "Veo Video Generation",
      "Unlock expert-grade professional models",
    ],
    theme: "from-emerald-600 to-emerald-700",
  }
};

interface PricingPlansProps {
  user: DhozziUser;
  onUpdateUser: (user: DhozziUser) => void;
  onClose: () => void;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ user, onUpdateUser, onClose }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleActivatePlan = (plan: 'premium' | 'platinum') => {
    const cost = planDetails[plan].cost;
    // This function assumes the user has enough KRX
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Add 24 hours

    const updatedUser: DhozziUser = {
      ...user,
      krxBalance: user.krxBalance - cost,
      plan: plan,
      planActiveUntil: expirationDate.toISOString(),
    };
    onUpdateUser(updatedUser);
    alert(`${planDetails[plan].name} plan activated for 24 hours!`);
  };

  const handlePurchaseAttempt = (planId: 'premium' | 'platinum') => {
    const cost = planDetails[planId].cost;
    if (user.krxBalance < cost) {
      setIsPaymentModalOpen(true);
    } else {
      handleActivatePlan(planId);
    }
  };

  const handlePaymentSuccess = (newBalance: number) => {
    onUpdateUser({ ...user, krxBalance: newBalance });
    // The modal will show a success message and the user can close it.
  };

  const isPlanActive = (plan: Plan) => {
    if (plan === 'basic') return user.plan === 'basic';
    return user.plan === plan;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4 animate-fade-in-fast">
          <div className="absolute top-4 right-4">
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                  <XIcon className="w-6 h-6" />
              </button>
          </div>
          
          <div className="text-center mb-8">
              <h1 className="text-4xl font-bold">Activate a Plan</h1>
              <p className="text-lg text-gray-400 mt-2">Use your KrunX to unlock more features for 24 hours.</p>
              <div className="mt-4 inline-flex items-center gap-3 bg-yellow-900/30 border border-yellow-700/50 rounded-full px-6 py-2">
                  <StarIcon className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-mono text-white">{user.krxBalance.toLocaleString()}</span>
                  <span className="text-lg text-yellow-400">KRX</span>
              </div>
              <div>
                <button 
                  onClick={() => setIsPaymentModalOpen(true)} 
                  className="mt-4 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full hover:opacity-90 transition-opacity"
                >
                  Buy More KRX
                </button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
              {Object.entries(planDetails).map(([planId, details]) => (
                  <div key={planId} className={`bg-gray-800/50 border-2 ${isPlanActive(planId as Plan) ? 'border-[--color-accent]' : 'border-white/10'} rounded-2xl p-8 flex flex-col`}>
                      <h2 className="text-2xl font-bold">{details.name}</h2>
                      <p className="text-gray-400 mt-1 flex items-center gap-2">
                          <StarIcon className="w-4 h-4 text-yellow-400"/>
                          <span className="font-semibold">{details.cost === 0 ? "Free" : `${details.cost} KRX / day`}</span>
                      </p>
                      <ul className="space-y-3 mt-8 text-gray-300 flex-1">
                          {details.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                  <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"/>
                                  <span>{feature}</span>
                              </li>
                          ))}
                      </ul>
                      <div className="mt-8">
                        {planId !== 'basic' && (
                            isPlanActive(planId as Plan) ? (
                                <button disabled className="w-full p-3 rounded-lg bg-gray-600 text-gray-400 font-semibold cursor-not-allowed">
                                    Currently Active
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handlePurchaseAttempt(planId as 'premium' | 'platinum')}
                                    className={`w-full p-3 rounded-lg font-semibold bg-gradient-to-r ${details.theme} text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    Activate for {details.cost} KRX
                                </button>
                            )
                        )}
                      </div>
                  </div>
              ))}
          </div>
      </div>
      <Suspense fallback={<></>}>
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          user={user}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </Suspense>
    </>
  );
};

export default PricingPlans;