const Subscription = () => {
  const plans = [
    {
      name: "Basic Plan",
      price: "Rp 299K",
      period: "/month",
      features: [
        "10 meals per month",
        "Basic customization",
        "Free delivery",
        "Nutritional info"
      ],
      popular: false
    },
    {
      name: "Premium Plan",
      price: "Rp 599K",
      period: "/month",
      features: [
        "20 meals per month",
        "Full customization",
        "Priority delivery",
        "Nutritionist consultation",
        "Recipe cards included"
      ],
      popular: true
    },
    {
      name: "Family Plan",
      price: "Rp 999K",
      period: "/month",
      features: [
        "40 meals per month",
        "Family customization",
        "Same-day delivery",
        "Family nutrition planning",
        "Bulk discounts"
      ],
      popular: false
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Choose Your Perfect Plan
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Select a subscription plan that fits your lifestyle and dietary goals.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 ${
                  plan.popular ? 'border-2 border-emerald-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{plan.name}</h3>
                <div className="text-3xl font-bold text-emerald-600 mb-6">
                  {plan.price}<span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 text-gray-600 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>✓ {feature}</li>
                  ))}
                </ul>
                <button className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Subscription
