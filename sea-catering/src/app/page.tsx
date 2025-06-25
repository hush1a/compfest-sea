import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={`min-h-screen ${plusJakartaSans.className}`}>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "url('/hero-bg.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl tracking-tight">
              <span className="text-emerald-400">SEA</span> Catering
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 font-medium drop-shadow-md">
              "Healthy Meals, Anytime, Anywhere"
            </p>
            <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto drop-shadow-md mb-12">
              Welcome to SEA Catering, your premier destination for customizable healthy meal services. 
              We deliver nutritious, delicious meals across Indonesia, bringing wellness and convenience 
              right to your doorstep.
            </p>
            
            {/* Testimonial Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">1000+</div>
                <div className="text-sm md:text-base text-gray-300">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">50K+</div>
                <div className="text-sm md:text-base text-gray-300">Meals Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">25+</div>
                <div className="text-sm md:text-base text-gray-300">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">4.9★</div>
                <div className="text-sm md:text-base text-gray-300">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Added background for contrast */}
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose SEA Catering?
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Feature Card 1 - Extends to Left */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="flex items-center">
                {/* Extended Image - Left Side */}
                <div className="w-0 group-hover:w-80 transition-all duration-500 ease-in-out overflow-hidden">
                  <img 
                    src="/feature-1.jpg" 
                    alt="Meal Customization" 
                    className="w-80 h-40 object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-8">
                  <div className="flex items-start gap-6">
                    {/* Small Preview Image */}
                    <div className="w-16 h-16 group-hover:w-0 group-hover:h-0 transition-all duration-500 ease-in-out overflow-hidden rounded-lg flex-shrink-0">
                      <img 
                        src="/feature-1.jpg" 
                        alt="Meal Customization Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Meal Customization</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        Tailor your meals to your dietary preferences, allergies, and nutritional goals with our flexible customization options.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2 - Extends to Right */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="flex items-center">
                {/* Content */}
                <div className="flex-1 p-8">
                  <div className="flex items-start gap-6">
                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Indonesia-Wide Delivery</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        Enjoy our healthy meals wherever you are in Indonesia. We deliver to major cities across the archipelago.
                      </p>
                    </div>
                    
                    {/* Small Preview Image */}
                    <div className="w-16 h-16 group-hover:w-0 group-hover:h-0 transition-all duration-500 ease-in-out overflow-hidden rounded-lg flex-shrink-0">
                      <img 
                        src="/feature-2.jpg" 
                        alt="Indonesia-Wide Delivery Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Extended Image - Right Side */}
                <div className="w-0 group-hover:w-80 transition-all duration-500 ease-in-out overflow-hidden">
                  <img 
                    src="/feature-2.jpg" 
                    alt="Indonesia-Wide Delivery" 
                    className="w-80 h-40 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Feature Card 3 - Extends to Left */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="flex items-center">
                {/* Extended Image - Left Side */}
                <div className="w-0 group-hover:w-80 transition-all duration-500 ease-in-out overflow-hidden">
                  <img 
                    src="/feature-3.jpg" 
                    alt="Detailed Nutritional Information" 
                    className="w-80 h-40 object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-8">
                  <div className="flex items-start gap-6">
                    {/* Small Preview Image */}
                    <div className="w-16 h-16 group-hover:w-0 group-hover:h-0 transition-all duration-500 ease-in-out overflow-hidden rounded-lg flex-shrink-0">
                      <img 
                        src="/feature-3.jpg" 
                        alt="Nutritional Information Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Detailed Nutritional Information</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        Make informed choices with comprehensive nutritional breakdowns for every meal, helping you stay on track with your health goals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 4 - Extends to Right */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="flex items-center">
                {/* Content */}
                <div className="flex-1 p-8">
                  <div className="flex items-start gap-6">
                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Flexible Scheduling</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        Order meals on your schedule - daily, weekly, or monthly plans available to fit your lifestyle perfectly.
                      </p>
                    </div>
                    
                    {/* Small Preview Image */}
                    <div className="w-16 h-16 group-hover:w-0 group-hover:h-0 transition-all duration-500 ease-in-out overflow-hidden rounded-lg flex-shrink-0">
                      <img 
                        src="/feature-4.jpg" 
                        alt="Flexible Scheduling Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Extended Image - Right Side */}
                <div className="w-0 group-hover:w-80 transition-all duration-500 ease-in-out overflow-hidden">
                  <img 
                    src="/feature-4.jpg" 
                    alt="Flexible Scheduling" 
                    className="w-80 h-40 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Feature Card 5 - Extends to Left */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="flex items-center">
                {/* Extended Image - Left Side */}
                <div className="w-0 group-hover:w-80 transition-all duration-500 ease-in-out overflow-hidden">
                  <img 
                    src="/feature-5.jpg" 
                    alt="Fresh & Quality Ingredients" 
                    className="w-80 h-40 object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-8">
                  <div className="flex items-start gap-6">
                    {/* Small Preview Image */}
                    <div className="w-16 h-16 group-hover:w-0 group-hover:h-0 transition-all duration-500 ease-in-out overflow-hidden rounded-lg flex-shrink-0">
                      <img 
                        src="/feature-5.jpg" 
                        alt="Fresh Ingredients Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Fresh & Quality Ingredients</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        We source only the freshest, highest-quality ingredients to ensure every meal is both nutritious and delicious.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6">Get in Touch!</h3>
            <div className="bg-gray-800 rounded-lg p-8 inline-block">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-300 text-sm">Manager</p>
                    <p className="font-semibold">Brian</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-300 text-sm">Phone</p>
                    <p className="font-semibold">08123456789</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-400 mt-8 text-sm">
              © 2025 SEA Catering.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
