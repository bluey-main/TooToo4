import React, { useEffect, useState } from 'react';

interface StripeAccountNoticeProps {
  hasStripeAccount: boolean;
  isSubscribed: boolean;
}

const StripeAccountNotice: React.FC<StripeAccountNoticeProps> = ({ hasStripeAccount, isSubscribed }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('stripe_notice_dismissed');
    if (!dismissed) {
      if (!hasStripeAccount || !isSubscribed) {
        setVisible(true);
      }
    }
  }, [hasStripeAccount, isSubscribed]);

  const handleDismiss = () => {
    localStorage.setItem('stripe_notice_dismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-white p-6 shadow-xl border border-gray-200 rounded-2xl max-w-2xl mx-auto my-10">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Complete Your Setup</h2>
      
      {!hasStripeAccount && (
        <div className="mb-4">
          <p className="text-gray-700">
            To list your products, receive payments, and operate on the platform, you need to connect a Stripe account.
          </p>
        </div>
      )}

      {!isSubscribed && (
        <div className="mb-4">
          <h3 className="text-gray-800 font-semibold mb-1">Why Subscribe?</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Faster payouts</li>
            <li>Lower transaction fees</li>
            <li>Priority product placement</li>
            <li>Exclusive access to marketing tools</li>
          </ul>
        </div>
      )}

      <button
        onClick={handleDismiss}
        className="mt-4 bg-[#086047] text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        Okay, got it
      </button>
    </div>
  );
};

export default StripeAccountNotice;
