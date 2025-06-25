import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center pt-16"
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
          
          <div className="mt-8">
            <Link 
              to="/menu" 
              className="inline-block bg-emerald-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-emerald-600 transition-colors no-underline"
            >
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
