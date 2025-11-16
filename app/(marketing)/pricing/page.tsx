import React from 'react';

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Basic templates",
        "5 AI voice conversations/month",
        "AI resume (1/month)",
        "Recruiter messages (3/month)",
        "Powered by Link4Coders footer"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$9",
      description: "For serious developers",
      features: [
        "Unlimited voice conversations",
        "Unlimited resumes",
        "All premium templates",
        "Custom domains",
        "Portfolio optimization",
        "Skill gap analyzer"
      ],
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Premium",
      price: "$29",
      description: "For professional developers",
      features: [
        "All Pro features",
        "Voice cloning",
        "Priority voice processing",
        "Advanced analytics",
        "Unlimited recruiter voice notes",
        "Interview practice"
      ],
      cta: "Go Premium",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF914D] bg-clip-text text-transparent mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that works best for you and your career goals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-2xl p-8 shadow-lg border-2 ${
                plan.popular 
                  ? 'border-[#FF6B35] bg-white/30 backdrop-blur-md relative' 
                  : 'border-gray-200 dark:border-gray-700 bg-white/20 backdrop-blur-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#FF6B35] text-white text-sm font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h2>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-300">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                plan.popular
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white hover:from-[#FF844B] hover:to-[#FFB088] shadow-lg'
                  : 'border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}