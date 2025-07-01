'use client'

import SubscriptionForm from '../../components/SubscriptionForm'
import PageHeader from '../../components/PageHeader'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import ProtectedRoute from '../../components/auth/ProtectedRoute'

export default function SubscriptionPage() {
  return (
    <ProtectedRoute>
      <Navigation />
      <div className="pt-16">
        <PageHeader 
          title="Create Your Subscription"
          description="Fill out the form below to customize your meal plan and start your healthy eating journey with SEA Catering."
        />
        
        {/* Subscription Form Section */}
        <section id="subscription-form" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <SubscriptionForm />
          </div>
        </section>
        
        {/* Additional subscription benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why Subscribe to SEA Catering?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Money</h3>
                  <p className="text-gray-600">Get up to 20% savings compared to individual meal orders with our subscription plans.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Guaranteed Delivery</h3>
                  <p className="text-gray-600">Never worry about meal planning again with our reliable, scheduled deliveries.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Quality</h3>
                  <p className="text-gray-600">Experience consistently high-quality meals prepared by our professional chefs.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Plans</h3>
                  <p className="text-gray-600">Easy to pause, modify, or cancel your subscription anytime to fit your lifestyle.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </ProtectedRoute>
  )
}
