"use client";

import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";
import { Check, Crown } from "lucide-react";
import { api } from "@/lib/api";

export default function SubscriptionPage() {
  const user = useAuthStore((s) => s.user);

  const currentPlan = user?.plan || "Free";

  const plans = [
    {
      name: "Free",
      price: "₹0",
      description: "Basic access",
      features: ["40 messages/day", "Basic AI responses", "With Ads"],
      popular: false,
    },
    {
      name: "Pro",
      price: "₹199/mo",
      description: "More debating",
      features: [
        "200 messages/day",
        "Faster AI responses",
        "Multiple AI personalities",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: "₹599/mo",
      description: "Coaching features",
      features: [
        "500 messages per day",
        "Everything in Pro",
        "AI coaching insights",
        "Voice debates",
        "Advanced feedback",
      ],
      popular: false,
    },
  ];

  const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);

    document.body.appendChild(script);
  });
};

const handlePayment = async (plan: string) => {

  const loaded = await loadRazorpay();

  if (!loaded) {
    toast.error("Failed to load payment");
    return;
  }

  const order = await api.post("/payment/create-order", {
    plan
  });

  const options = {
    key: "YOUR_KEY_ID",
    amount: order.data.amount,
    currency: order.data.currency,
    order_id: order.data.id,

    handler: async function (response: any) {

      await api.post("/payment/verify", {
        ...response,
        plan
      });

      toast.success("Payment successful!");
      window.location.reload();
    }
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">
          Choose Your Plan
        </h1>

        <p className="text-gray-600">
          Upgrade your debating skills with powerful AI features.
        </p>

        <p className="text-sm text-gray-500">
          Current Plan: <span className="font-semibold">{currentPlan}</span>
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.name;

          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border transition hover:shadow-xl
              ${
                plan.popular
                  ? "bg-black text-white scale-105 shadow-2xl"
                  : "bg-white"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Crown size={14} />
                  Most Popular
                </div>
              )}

              {/* Title */}
              <h2 className="text-xl font-bold mb-1">
                {plan.name}
              </h2>

              <p
                className={`text-sm mb-4 ${
                  plan.popular ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="text-3xl font-bold mb-6">
                {plan.price}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                disabled={isCurrent}
                // onClick={() => upgrade(plan.name)}
                onClick={() => handlePayment(plan.name)}
                className={`w-full py-2 rounded-lg font-medium transition
                  ${
                    isCurrent
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : plan.popular
                      ? "bg-white text-black hover:scale-105"
                      : "border hover:bg-black hover:text-white"
                  }
                `}
              >
                {isCurrent ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust Section */}
      <div className="text-center text-sm text-gray-500 pt-6">
        Secure payments • Cancel anytime • No hidden fees
      </div>
    </div>
  );
}